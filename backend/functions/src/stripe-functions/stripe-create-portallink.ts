import { onCall, HttpsError } from "firebase-functions/v2/https";
import Stripe from "stripe";
import * as logs from "./logs";
import { createCustomerRecord } from "./common";
import config from "./config";
import { stripe } from "./common";

import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

if (getApps().length === 0) {
  initializeApp();
}

const db = getFirestore();

/**
 * Create a billing portal link
 */
export const createPortalLink = onCall(
  {
    // allow cors for routes of https://example.web.app
    cors: ["http://127.0.0.1:3000"],
    enforceAppCheck: true,
  },
  //   async (data, context) => {
  async (request) => {
    // Checking that the user is authenticated.
    logs.info("createPortalLink", request.data);

    const uid = request.auth?.uid;
    if (!uid) {
      // Throwing an HttpsError so that the client gets the error details.
      throw new HttpsError(
        "unauthenticated",
        "The function must be called while authenticated!"
      );
    }
    try {
      // TODO: Add input validation
      const {
        returnUrl: return_url,
        locale = "auto",
        configuration,
        // flow_data,
      } = request.data;

      // Get stripe customer id
      let customerRecord = (
        await db.collection(config.customersCollectionPath).doc(uid).get()
      ).data();

      if (!customerRecord?.stripeId) {
        // Create Stripe customer on-the-fly
        const { email, phoneNumber } = await getAuth().getUser(uid);
        customerRecord = (await createCustomerRecord({
          uid,
          email,
          phone: phoneNumber,
        })) as any;
      }

      if (!customerRecord) {
        throw new Error("No customer record found");
      }

      console.log("customerRecord", customerRecord);
      const customer = customerRecord.stripeId;

      const params: Stripe.BillingPortal.SessionCreateParams = {
        customer,
        return_url,
        locale,
      };
      if (configuration) {
        params.configuration = configuration;
      }

      const session = await stripe.billingPortal.sessions.create(params);
      logs.createdBillingPortalLink(uid);
      return session;
    } catch (error) {
      logs.billingPortalLinkCreationError(uid, error as Error);
      throw new HttpsError("internal", (error as Error).message);
    }
  }
);
