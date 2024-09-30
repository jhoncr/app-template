/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as z from "zod";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps } from "firebase-admin/app";

if (getApps().length === 0) {
  initializeApp();
}

const db = getFirestore();

const schema = z
  .object({
    journalID: z.string(),
  })
  .strict();

// allow cors for all origins
export const acceptShare = onCall(
  {
    cors: ["https://example.web.app"],
    enforceAppCheck: true,
  },
  async (request) => {
    try {
      logger.info("acceptShare called");
      // retunn erro if not authenticated
      if (!request.auth) {
        throw new HttpsError(
          "unauthenticated",
          "You must be signed in to add a message"
        );
      }

      // check if the request.data is valid
      const result = schema.safeParse(request.data);
      if (!result.success) {
        throw new HttpsError(
          "invalid-argument",
          result.error.issues.map((issue) => issue.message).join("\n")
        );
      }

      // get the logId from the request
      const logId = result.data.journalID;
      const uid = request.auth.uid;
      const email = request.auth.token.email;

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

        // if the user is in the logDoc.pendingAccess map, add them to the
        // logDoc.access map and remove them from the logDoc.pendingAccess map
        const logData = logDoc.data() || {};
        console.log("checking if user is in logDoc.pendingAccess map");
        if (
          email &&
          request.auth &&
          Object.getOwnPropertyDescriptor(logData?.pending_access ?? {}, email)
        ) {
          console.log("adding user to logDoc.access map");
          const newPendingAccess = { ...logData.pending_access };
          delete newPendingAccess[email];

          transaction.update(logDocRef, {
            access: {
              ...logData.access,
              [uid]: {
                role: logData.pending_access[email],
                email: email,
                displayName: request.auth.token.name || "",
                photoURL: request.auth.token.picture || "",
              },
            },
            pending_access: newPendingAccess,
          });
        }
      });
    } catch (error) {
      logger.log("Error accepting share", error);
      // check if erros is a https error
      if (error instanceof HttpsError) {
        throw error;
      }
      throw new HttpsError(
        "internal",
        "Error accepting shared. Please try again later."
      );
    }

    // return ok
    return { result: "ok", message: "Added log entry" };
  }
);
