import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {getFirestore, FieldValue} from "firebase-admin/firestore";
import {initializeApp, getApps} from "firebase-admin/app";
import * as z from "zod";

if (getApps().length === 0) {
  initializeApp();
}

const db = getFirestore();

const ADD_ROLES = new Set(["admin", "editor"]);

const dataSchema = z.object({
  logID: z.string().min(3).max(100),
  entryID: z.string().min(3).max(100),
});

export const deleteEntry = onCall(
  {
    cors: ["https://nessedia.web.app"],
    enforceAppCheck: true,
  },
  async (request) => {
    try {
      // Check if the user is logged in
      if (!request.auth) {
        throw new HttpsError("unauthenticated", "User is not logged in.");
      }

      const uid = request.auth.uid;

      // assert that logID and entryID are strings and not empty
      const result = dataSchema.safeParse(request.data);
      if (!result.success) {
        throw new HttpsError("invalid-argument", "Invalid data provided.");
      }

      // create a new doc the log document
      const logRef = db.collection("logs").doc(result.data.logID);
      const logDoc = await logRef.get();

      // check if the log exists
      if (!logDoc.exists) {
        throw new HttpsError("not-found", "Log not found.");
      }

      const logData = logDoc.data();
      if (!logData) {
        throw new HttpsError("internal", "Log data is empty.");
      }

      const access = logData.access;
      if (!access || !access[uid] || !ADD_ROLES.has(access[uid].role)) {
        logger.warn("User does not have permission to delete this entry.");
        throw new HttpsError(
          "permission-denied",
          "You do not have permission to delete this entry."
        );
      }

      // add a is_active: false field to the entry
      const entryRef = logRef.collection("entries").doc(result.data.entryID);

      await entryRef.update({
        is_active: false,
        deletedAt: FieldValue.serverTimestamp(),
        deletedBy: uid,
      });

      return {message: "Entry deleted successfully."};
    } catch (error) {
      logger.error("deleteEntry: error", error);
      if (error instanceof HttpsError) {
        throw error;
      }
      throw new HttpsError(
        "internal",
        "An error occurred while deleting the entry."
      );
    }
  }
);
