import { onCall, HttpsError } from "firebase-functions/v2/https";
import { initializeApp, getApps } from "firebase-admin/app";
import { auth } from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { stripe } from "./common";
import config from "./config";
import { createCustomerRecord } from "./common";
import { logger } from "firebase-functions/v2";
import { AuthData } from "firebase-functions/tasks";

if (getApps().length === 0) {
  initializeApp();
}

const db = getFirestore();

/**
 * Create a createCheckoutSession function
 */
export const createCheckoutSessionFn = onCall(
  {
    // allow cors for routes of https://example.web.app
    cors: ["http://127.0.0.1:3000"],
    enforceAppCheck: true,
  },
  async (request) => {
    const { priceId } = request.data;
    const context = request.auth;

    if (!context) {
      throw new HttpsError(
        "unauthenticated",
        "The function must be called while authenticated."
      );
    }

    try {
      // check if firebase user has a custom claim stripeId with stripe customer id, if not create a new stripe customer
      let stripeId = await getStripeId(context);

      // check if session_id is in the params, if so return the session url
      if (request.data.session_id) {
        const session = await stripe.checkout.sessions.retrieve(
          request.data.session_id
        );
        return {
          url: session.url,
          status: session.status,
        };
      }

      const session = await stripe.checkout.sessions.create({
        ui_mode: "embedded",
        line_items: [
          {
            // price: product.default_price,
            // price: productId,
            price: priceId,
            quantity: 1,
            adjustable_quantity: {
              enabled: true,
              minimum: 0,
              maximum: 10,
            },
          },
        ],
        mode: "payment",
        // success_url: config.successUrl,
        // cancel_url: config.cancelUrl,
        customer: stripeId,
        return_url: config.embbededUrl,
        // automatic_tax: { enabled: true },
      });

      return {
        url: session.url,
        clientSecret: session.client_secret,
      };
    } catch (error) {
      logger.error("🚩 error", error);
      throw new HttpsError("unknown", (error as Error).message, error);
    }
  }
);

// create a PaymentIntent Endpoint
export const createPaymentIntent = onCall(
  {
    // allow cors for routes of https://example.web.app
    cors: ["http://127.0.0.1:3000"],
    enforceAppCheck: true,
  },
  async (request) => {
    const { amount } = request.data;
    const context = request.auth;

    if (!context) {
      throw new HttpsError(
        "unauthenticated",
        "The function must be called while authenticated."
      );
    }

    try {
      // check if firebase user has a custom claim stripeId with stripe customer id, if not create a new stripe customer
      let stripeId = await getStripeId(context);

      // check if session_id is in the params, if so return the session url
      if (request.data.session_id) {
        const session = await stripe.checkout.sessions.retrieve(
          request.data.session_id
        );
        return {
          url: session.url,
          status: session.status,
        };
      }

      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd", // Change if needed
        customer: stripeId,
        automatic_payment_methods: {
          enabled: true,
        },
        // payment_method_types: ["card", "google_pay"], // Add this line
        metadata: {
          vehicle: "chess_tokens",
          // ... any other metadata you need
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
      };
    } catch (error) {
      logger.error("🚩 error", error);
      throw new HttpsError("unknown", (error as Error).message, error);
    }
  }
);

async function getStripeId(context: AuthData) {
  let stripeId = context.token?.stripeId;

  if (!stripeId) {
    // check the clustomer collection to see if the stripe customer id is there
    const dbCustomer = (
      await db.collection(config.customersCollectionPath).doc(context.uid).get()
    ).data();

    if (dbCustomer?.stripeId) {
      stripeId = dbCustomer.stripeId;
      logger.log("📃 found strip customer id in the db");
    } else {
      logger.log(
        "createCheckoutSessionFn",
        "No stripe customer id found in custom claims, creating a new stripe customer"
      );

      const customerRecord = await createCustomerRecord({
        uid: context.uid,
        email: context.token.email,
        phone: context.token.phone_number,
      });

      if (!customerRecord || !customerRecord.stripeId) {
        logger.error("🟡 Failed to create a new stripe customer");
        throw new HttpsError(
          "unknown",
          "Failed to create a new stripe customer"
        );
      }
      stripeId = customerRecord.stripeId;
    }
    logger.log("🟢 Stripe customer id created, setting custom claim");
    await auth().setCustomUserClaims(context.uid, {
      stripeId: stripeId,
    });
  } else {
    logger.log("🟢 Stripe customer id found in custom claims");
  }
  return stripeId;
}
