/**
 * Firebase function to handle quote operations.
 */
import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as z from "zod";
import {
  getFirestore,
  FieldValue,
  Transaction,
} from "firebase-admin/firestore";
import { initializeApp, getApps } from "firebase-admin/app";

if (getApps().length === 0) {
  initializeApp();
}

const db = getFirestore();
const QUOTES_COLLECTION = "quotes";
const QUOTE_HISTORY_COLLECTION = `history/${QUOTES_COLLECTION}/v0`;

// Define the schema for quote data
const quoteSchema = z.object({
  clientId: z
    .string()
    .min(3, { message: "Client ID must be at least 3 characters" }),
  laborCostType: z.enum(["percentage", "fixed"]),
  laborCostValue: z
    .number()
    .min(0.01, { message: "Labor value must be greater than 0" }),
  shippingCost: z
    .number()
    .min(0.01, { message: "Shipping cost must be greater than 0" }),
  status: z
    .enum(["pending", "sent", "accepted", "deactivated"])
    .default("pending"),
  items: z
    .array(
      z.object({
        materialId: z.string(),
        quantity: z
          .number()
          .min(0.01, { message: "Item quantity must be greater than 0" }),
        notes: z.string().optional(), // Added notes
        picture: z.string().url().optional(), // Added picture URL, validated as URL
      })
    )
    .optional()
    .default([]), // Items is now part of the schema and defaulted to empty array
});

// Function to create a new quote
export const createQuote = onCall(
  { cors: ["http://localhost:3000"], enforceAppCheck: true },
  async (request) => {
    try {
      logger.info("createQuote called");
      if (!request.auth) {
        throw new HttpsError(
          "unauthenticated",
          "You must be signed in to create a quote."
        );
      }

      // Validate the data
      const result = quoteSchema.safeParse(request.data);
      if (!result.success) {
        throw new HttpsError(
          "invalid-argument",
          result.error.issues.map((issue) => issue.message).join("\n")
        );
      }
      const uid = request.auth.uid;
      // Create new quote document in the firestore
      const quoteRef = db.collection(QUOTES_COLLECTION).doc();
      await quoteRef.set({
        ...result.data,
        // items: [],
        version: 1,
        createdAt: FieldValue.serverTimestamp(),
        createdBy: uid,
      });

      return {
        result: "ok",
        message: "Quote created successfully",
        quoteId: quoteRef.id,
      };
    } catch (error) {
      logger.error("Error creating quote", error);
      throw new HttpsError(
        "internal",
        "Error creating quote. Please try again later"
      );
    }
  }
);

// Function to get all quotes.
export const getQuotes = onCall(
  { cors: ["http://localhost:3000"], enforceAppCheck: true },
  async (request) => {
    try {
      logger.info("getQuotes called");
      if (!request.auth) {
        throw new HttpsError(
          "unauthenticated",
          "You must be signed in to get quotes."
        );
      }
      const quotes: any[] = [];
      const querySnapshot = await db
        .collection(QUOTES_COLLECTION)
        .where("status", "in", ["pending", "sent", "accepted"])
        .get();
      querySnapshot.forEach((doc) => {
        quotes.push({ ...doc.data(), id: doc.id });
      });

      return { result: "ok", quotes };
    } catch (error) {
      logger.error("Error getting quotes", error);
      throw new HttpsError(
        "internal",
        "Error getting quotes. Please try again later"
      );
    }
  }
);

// Function to update an existing quote (with versioning)
export const updateQuote = onCall(
  { cors: ["http://localhost:3000"], enforceAppCheck: true },
  async (request) => {
    try {
      logger.info("updateQuote called");
      if (!request.auth) {
        throw new HttpsError(
          "unauthenticated",
          "You must be signed in to update a quote."
        );
      }

      const quoteId = request.data.id;

      // Validate the data
      const result = quoteSchema.safeParse(request.data);
      if (!result.success) {
        throw new HttpsError(
          "invalid-argument",
          result.error.issues.map((issue) => issue.message).join("\n")
        );
      }
      const uid = request.auth.uid;

      await db.runTransaction(async (transaction: Transaction) => {
        const quoteRef = db.collection(QUOTES_COLLECTION).doc(quoteId);
        const quoteDoc = await transaction.get(quoteRef);

        if (!quoteDoc.exists) {
          throw new HttpsError("not-found", "Quote not found");
        }
        const quoteData = quoteDoc.data();
        if (!quoteData) {
          throw new HttpsError("not-found", "Quote data is undefined");
        }

        transaction.update(quoteRef, {
          ...result.data,
          version: quoteData.version + 1,
          updatedAt: FieldValue.serverTimestamp(),
          updatedBy: uid,
        });

        const newQuoteRef = db.collection(QUOTE_HISTORY_COLLECTION).doc();
        transaction.set(newQuoteRef, {
          ...quoteData,
          status: "deactivated",
          historyId: quoteId,
          updatedAt: FieldValue.serverTimestamp(),
          updatedBy: uid,
        });
      });

      return { result: "ok", message: "Quote updated successfully" };
    } catch (error) {
      logger.error("Error updating quote", error);
      throw new HttpsError(
        "internal",
        "Error updating quote. Please try again later"
      );
    }
  }
);

// Function to "delete" an existing quote by deactivating it
export const deleteQuote = onCall(
  { cors: ["http://localhost:3000"], enforceAppCheck: true },
  async (request) => {
    try {
      logger.info("deleteQuote called");
      if (!request.auth) {
        throw new HttpsError(
          "unauthenticated",
          "You must be signed in to delete a quote."
        );
      }

      const quoteId = request.data.id;

      // update quote document in the firestore to set the status to deactivated
      const quoteRef = db.collection(QUOTES_COLLECTION).doc(quoteId);
      await quoteRef.update({
        status: "deactivated",
        updatedAt: FieldValue.serverTimestamp(),
        updatedBy: request.auth.uid,
      });

      return { result: "ok", message: "Quote deactivated successfully" };
    } catch (error) {
      logger.error("Error deleting quote", error);
      throw new HttpsError(
        "internal",
        "Error deleting quote. Please try again later"
      );
    }
  }
);

// Function to get a single quote by ID.
export const getQuote = onCall(
  { cors: ["http://localhost:3000"], enforceAppCheck: true },
  async (request) => {
    try {
      logger.info("getQuote called");
      if (!request.auth) {
        throw new HttpsError(
          "unauthenticated",
          "You must be signed in to get a quote."
        );
      }

      const quoteId = request.data.id;
      if (!quoteId) {
        throw new HttpsError(
          "invalid-argument",
          "The function must be called with a quote ID."
        );
      }

      const quoteDoc = await db
        .collection(QUOTES_COLLECTION)
        .doc(quoteId)
        .get();

      if (!quoteDoc.exists) {
        throw new HttpsError("not-found", "Quote not found");
      }

      const quoteData = quoteDoc.data();
      if (!quoteData) {
        throw new HttpsError("not-found", "Quote data is undefined");
      }

      return { result: "ok", quote: { ...quoteData, id: quoteDoc.id } }; // Include document ID in response
    } catch (error) {
      logger.error("Error getting quote", error);
      if (error instanceof HttpsError) {
        throw error; // Re-throw HTTP errors for client to handle
      }
      throw new HttpsError(
        "internal",
        "Error getting quote. Please try again later."
      );
    }
  }
);
