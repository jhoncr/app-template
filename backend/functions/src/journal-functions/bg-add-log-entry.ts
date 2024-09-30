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
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { initializeApp, getApps } from "firebase-admin/app";

if (getApps().length === 0) {
  initializeApp();
}

const db = getFirestore();

const ADD_ROLES = new Set(["reporter", "admin", "editor"]);

const logFormSchema = z.object({
  description: z
    .string()
    .min(3, {
      message: "The description must be at least 4 characters.",
    })
    .max(254, {
      message: "A max of 254 caracters is allowed on the description.",
    }),
  date: z.coerce.date({
    required_error: "A entry date is required",
  }),
  type: z.enum(["received", "paid"], {
    required_error: "Please select an entry type.",
  }),
  // value for currency
  value: z.number().min(0.01, {
    message: "The value must be greater than 0.",
  }),
  id: z.string(),
});

// allow cors for all origins
export const addLogFn = onCall(
  {
    // allow cors for routes of https://example.web.app
    cors: ["https://example.web.app"],
    enforceAppCheck: true,
  },
  async (request) => {
    try {
      logger.info("addLogFn called");
      // retunn erro if not authenticated
      if (!request.auth) {
        throw new HttpsError(
          "unauthenticated",
          "You must be signed in to add an entry"
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

      // check if the user is allowed to add a log entry by:
      //  -  getting the logs/{logId} document and
      //  -  checking if the user is in doc.data().access map
      // if the user is not allowed, throw an error
      // if the user is allowed, add the log entry to the logs/{logId}/entries
      // collection

      // get the logId from the request
      const logId = result.data.id;
      const uid = request.auth.uid;

      // get the log document
      const logDocRef = db.collection("logs").doc(logId);
      const logDoc = await logDocRef.get();

      // check if the log document exists
      if (!logDoc.exists) {
        throw new HttpsError(
          "not-found",
          "The log document does not exist or you do not have access to it."
        );
      }

      // check if the user is allowed to add a log entry
      const logData = logDoc.data() || {};
      if (
        !Object.getOwnPropertyDescriptor(logData?.access ?? {}, uid) ||
        !ADD_ROLES.has(logData?.access?.[uid]?.role)
      ) {
        throw new HttpsError(
          "permission-denied",
          "You do not have access to this log."
        );
      }

      logger.info("User is allowed to add a log entry");
      logger.info("Adding log entry to the log document");

      // add the log entry to the log document
      await logDocRef.collection("entries").add({
        description: result.data.description,
        date: result.data.date,
        type: result.data.type,
        value: result.data.value,
        createdAt: FieldValue.serverTimestamp(),
        createdBy: uid,
        is_active: true,
      });
    } catch (error) {
      logger.error("Error adding log entry to the log document", error);
      throw new HttpsError(
        "internal",
        "Error adding log entry to the log document"
      );
    }

    // return ok
    return { result: "ok", message: "Added log entry" };
  }
);
