/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as z from "zod";
import {getFirestore} from "firebase-admin/firestore";
import {initializeApp, getApps} from "firebase-admin/app";

if (getApps().length === 0) {
  initializeApp();
}

const db = getFirestore();

const ROLES = ["viewer", "reporter", "editor", "to_remove", "admin"] as const; // , "admin"];
const SHARE_ROLES = new Set(["admin"]);

const logFormSchema = z.object({
  people: z.array(
    z.object({
      email: z.string().email(),
      role: z.enum(ROLES),
      is_pending: z.boolean().optional(),
    })
  ).max(10, "You can only share with up to 10 people"),
  logID: z.string(),
}).strict();

type Person = z.infer<typeof logFormSchema>["people"][0];

type Contributer = {
  role: string;
  email: string;
  displayName: string;
  photoURL: string;
  uid?: string;
};

// allow cors for all origins
export const addContributer = onCall(
  {
    cors: ["https://nessedia.web.app"],
    enforceAppCheck: true,
  },
  async (request) => {
    try {
      logger.info("addContributer called");
      // retunn erro if not authenticated
      if (!request.auth) {
        throw new HttpsError(
          "unauthenticated",
          "You must be signed in to add a message"
        );
      }

      // check if the request.data is valid
      const result = logFormSchema.safeParse(request.data);
      if (!result.success) {
        throw new HttpsError(
          "invalid-argument",
          result.error.issues.map((issue) => issue.message).join("\n")
        );
      }

      // get the logId from the request
      const logId = result.data.logID;
      const uid = request.auth.uid;

      // transaction to dd the people to logDoc.access map
      await db.runTransaction(async (transaction) => {
        // get the log document
        const logDocRef = db.collection("logs").doc(logId);
        const logDoc = await transaction.get(logDocRef);

        // check if the log document exists
        if (!logDoc.exists) {
          throw new HttpsError(
            "not-found",
            "The log document does not exist or you do not have access to it."
          );
        }

        // check if the user is allowed to share a log entry
        const logData = logDoc.data();
        // TODO: check the logData has a valid document agains the schema

        const pendingAccess = logData?.pending_access ?? {};
        const hasAccess: { [uid: string]: Contributer } =
          logData?.access ?? {};
        if (
          !(uid in hasAccess) ||
          !SHARE_ROLES.has(hasAccess[uid].role)
        ) {
          throw new HttpsError(
            "permission-denied",
            "You do not have permission to share this log."
          );
        }

        logger.info("User is allowed to share this journal");
        logger.debug("logData", logData);
        logger.debug("result.data.", result.data);

        // create a map of email to Contributer from hasAccess
        const curEmailToUid: { [email: string]: string } = {};
        Object.keys(hasAccess).forEach((uid) => {
          curEmailToUid[hasAccess[uid].email] = uid;
        });

        const peopleToAdd: { [email: string]: string } = {}; // if email is not in hasAccess, add it
        const peopleToRemove: string[] = []; // if role is "to_remove" and email is in hasAccess, remove it

        // always keep the Admins
        const peopleToKeep: { [uid: string]: Contributer } = Object.fromEntries(
          Object.entries(hasAccess).filter(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ([uid, contributer]) => contributer.role === "admin"
          )
        );

        result.data.people.forEach((person: Person) => {
          if (person.email in curEmailToUid) {
            const uid = curEmailToUid[person.email];
            if (person.role === "to_remove") {
              peopleToRemove.push(uid); // TODO: change this to a map
            } else {
              peopleToKeep[uid] = {...hasAccess[uid], role: person.role};
            }
          } else {
            peopleToAdd[person.email] = person.role;
          }
        });

        // max of 10 people in the project
        if (
          Object.keys(peopleToAdd).length + Object.keys(peopleToKeep).length >
          10
        ) {
          throw new HttpsError(
            "invalid-argument",
            "You can only share with up to 10 people"
          );
        }

        const toEmail = Object.keys(peopleToAdd).filter(
          (email) => !(email in pendingAccess)
        );
        console.debug({toEmail});
        if (toEmail.length > 0) {
          // add doc to /mail collection
          const getBody = (email: string) => {
            const URL = `https://nessedia.web.app/share?journal=${logId}&email=${email}`;
            return {
              subject: `You have been invited to contribute to ${logData?.title}`,
              html: `You have been invited to contribute to ${logData?.title}. 
              Click the link to accept the invitation: ${URL}`,
            };
          };
          toEmail.forEach((email) => {
            transaction.set(db.collection("mail").doc(), {
              to: email,
              message: getBody(email),
            });
          });
        }

        // Create logic to check if email was sent
        transaction.update(logDocRef, {
          access: {
            ...peopleToKeep,
          },
          pending_access: {...peopleToAdd},
        });
      });
    } catch (error) {
      logger.log("Error adding contributers", error);
      // check if erros is a https error
      if (error instanceof HttpsError) {
        throw error;
      }
      throw new HttpsError(
        "internal",
        "Error adding contributers. Please try again later."
      );
    }

    // return ok
    return {result: "ok", message: "Added log entry"};
  }
);
