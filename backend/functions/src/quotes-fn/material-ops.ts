/**
 * Firebase function to handle material operations.
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
const MATERIALS_COLLECTION = "materials";

// Define the schema for material data
const materialSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().optional(),
  pricePerSqMeter: z
    .number()
    .min(0.01, { message: "Price must be greater than 0" }),
  type: z.enum(["granite", "flooring"]),
  status: z.enum(["active", "deactivated"]).default("active"),
});

// Function to create a new material
export const createMaterial = onCall(
  { cors: ["http://localhost:3000"], enforceAppCheck: true },
  async (request) => {
    try {
      logger.info("createMaterial called");
      if (!request.auth) {
        throw new HttpsError(
          "unauthenticated",
          "You must be signed in to create a material."
        );
      }

      // Validate the data
      const result = materialSchema.safeParse(request.data);
      if (!result.success) {
        throw new HttpsError(
          "invalid-argument",
          result.error.issues.map((issue) => issue.message).join("\n")
        );
      }
      const uid = request.auth.uid;
      // Create new material document in the firestore
      const materialRef = db.collection(MATERIALS_COLLECTION).doc();
      await materialRef.set({
        ...result.data,
        createdAt: FieldValue.serverTimestamp(),
        createdBy: uid,
      });

      return {
        result: "ok",
        message: "Material created successfully",
        materialId: materialRef.id,
      };
    } catch (error) {
      logger.error("Error creating material", error);
      throw new HttpsError(
        "internal",
        "Error creating material. Please try again later"
      );
    }
  }
);

// Function to get all materials.
export const getMaterials = onCall(
  { cors: ["http://localhost:3000"], enforceAppCheck: true },
  async (request) => {
    try {
      logger.info("getMaterials called");
      if (!request.auth) {
        throw new HttpsError(
          "unauthenticated",
          "You must be signed in to get materials."
        );
      }
      const materials: any[] = [];
      const querySnapshot = await db
        .collection(MATERIALS_COLLECTION)
        .where("status", "==", "active")
        .get();
      querySnapshot.forEach((doc) => {
        materials.push({ ...doc.data(), id: doc.id });
      });

      return { result: "ok", materials };
    } catch (error) {
      logger.error("Error getting materials", error);
      throw new HttpsError(
        "internal",
        "Error getting materials. Please try again later"
      );
    }
  }
);

// Function to update an existing material
export const updateMaterial = onCall(
  { cors: ["http://localhost:3000"], enforceAppCheck: true },
  async (request) => {
    try {
      logger.info("updateMaterial called");
      if (!request.auth) {
        throw new HttpsError(
          "unauthenticated",
          "You must be signed in to update a material."
        );
      }

      const materialId = request.data.id;

      // Validate the data
      const result = materialSchema.safeParse(request.data);
      if (!result.success) {
        throw new HttpsError(
          "invalid-argument",
          result.error.issues.map((issue) => issue.message).join("\n")
        );
      }
      const uid = request.auth.uid;
      // update material document in the firestore
      const materialRef = db.collection(MATERIALS_COLLECTION).doc(materialId);
      await materialRef.update({
        ...result.data,
        updatedAt: FieldValue.serverTimestamp(),
        updatedBy: uid,
      });
      return { result: "ok", message: "Material updated successfully" };
    } catch (error) {
      logger.error("Error updating material", error);
      throw new HttpsError(
        "internal",
        "Error updating material. Please try again later"
      );
    }
  }
);

// Function to "delete" an existing material by deactivating it
export const deleteMaterial = onCall(
  { cors: ["http://localhost:3000"], enforceAppCheck: true },
  async (request) => {
    try {
      logger.info("deleteMaterial called");
      if (!request.auth) {
        throw new HttpsError(
          "unauthenticated",
          "You must be signed in to delete a material."
        );
      }

      const materialId = request.data.id;

      // update material document in the firestore to set the status to deactivated
      const materialRef = db.collection(MATERIALS_COLLECTION).doc(materialId);
      await materialRef.update({
        status: "deactivated",
        updatedAt: FieldValue.serverTimestamp(),
        updatedBy: request.auth.uid,
      });

      return { result: "ok", message: "Material deactivated successfully" };
    } catch (error) {
      logger.error("Error deleting material", error);
      throw new HttpsError(
        "internal",
        "Error deleting material. Please try again later"
      );
    }
  }
);
