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

const schema = z
  .object({
    title: z
      .string()
      .min(3, "Please enter a title with at least 3 characters")
      .max(50, "The max length is 50 characters"),
    jtype: z.enum(["simple-cashflow"], {
      required_error: "Please select an entry type.",
    }),
  })
  .strict();

// allow cors for all origins
export const createNewJournal = onCall(
  {
    cors: ["https://example.web.app"],
    enforceAppCheck: true,
  },
  async (request) => {
    try {
      logger.info("createNewJournal called");
      // retunn erro if not authenticated
      if (!request.auth) {
        throw new HttpsError(
          "unauthenticated",
          "You must be signed in to create a message"
        );
      }

      // check if the request.data is valid
      const result = schema.safeParse(request.data);
      if (!result.success) {
        // return error to the client
        logger.error("Invalid request data", result.error);
        throw new HttpsError("invalid-argument", result.error.message);
      }

      const uid = request.auth.uid;

      // create a new doc the log document
      const logDocRef = db.collection("logs").doc();
      await logDocRef.set({
        title: result.data.title,
        jtype: result.data.jtype,
        access: {
          [uid]: {
            role: "admin",
            email: request.auth.token.email || null,
            displayName: request.auth.token.name || null,
            photoURL: request.auth.token.picture || null,
          },
        },
        createdAt: FieldValue.serverTimestamp(),
      });
      return {
        result: "ok",
        message: `Log journal created successfully. uuid: ${logDocRef.id}`,
      };
    } catch (error) {
      logger.error("Error creating new journal", error);
      throw new HttpsError(
        "internal",
        "Error creating new journal. Please try again later."
      );
    }

    // return ok
  }
);
