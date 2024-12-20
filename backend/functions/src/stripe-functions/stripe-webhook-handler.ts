import { onRequest, Request } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps } from "firebase-admin/app";

import * as logs from "./logs";
import config from "./config";

import Stripe from "stripe";
import {
  stripe,
  manageSubscriptionStatusChange,
  insertPaymentRecord,
  createProductRecord,
  insertPriceRecord,
  deleteProductOrPrice,
  insertInvoiceRecord,
  insertTaxRateRecord,
} from "./common";

if (getApps().length === 0) {
  initializeApp();
}

const db = getFirestore();
logs.info("webhook_secret", config.stripeWebhookSecret);
logs.info("webhook_secret 2", process.env.STRIPE_WEBHOOK_SECRET);

/**
 * A webhook handler function for the relevant Stripe events.
 */
export const handleWebhookEvents = onRequest(async (req: Request, resp) => {
  const relevantEvents = new Set([
    "product.created",
    "product.updated",
    "product.deleted",
    "price.created",
    "price.updated",
    "price.deleted",
    "checkout.session.completed",
    "checkout.session.async_payment_succeeded",
    "checkout.session.async_payment_failed",
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
    "tax_rate.created",
    "tax_rate.updated",
    "invoice.paid",
    "invoice.payment_succeeded",
    "invoice.payment_failed",
    "invoice.upcoming",
    "invoice.marked_uncollectible",
    "invoice.payment_action_required",
    "payment_intent.processing",
    "payment_intent.succeeded",
    "payment_intent.canceled",
    "payment_intent.payment_failed",
  ]);
  let event: Stripe.Event;

  // Instead of getting the `Stripe.Event`
  // object directly from `req.body`,
  // use the Stripe webhooks API to make sure
  // this webhook call came from a trusted source
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      req.headers["stripe-signature"] as string,
      config.stripeWebhookSecret as string
    );
  } catch (error) {
    logs.info("config.stripeWebhookSecret", config.stripeWebhookSecret);
    logs.badWebhookSecret(error as Error);
    resp.status(401).send("Webhook Error: Invalid Secret");
    return;
  }

  if (relevantEvents.has(event.type)) {
    logs.startWebhookEventProcessing(event.id, event.type);
    try {
      switch (event.type) {
        case "product.created":
        case "product.updated":
          await createProductRecord(event.data.object as Stripe.Product);
          break;
        case "price.created":
        case "price.updated":
          await insertPriceRecord(event.data.object as Stripe.Price);
          break;
        case "product.deleted":
          await deleteProductOrPrice(event.data.object as Stripe.Product);
          break;
        case "price.deleted":
          await deleteProductOrPrice(event.data.object as Stripe.Price);
          break;
        case "tax_rate.created":
        case "tax_rate.updated":
          await insertTaxRateRecord(event.data.object as Stripe.TaxRate);
          break;
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          const subscription = event.data.object as Stripe.Subscription;
          await manageSubscriptionStatusChange(
            subscription.id,
            subscription.customer as string,
            event.type === "customer.subscription.created"
          );
          break;
        case "checkout.session.completed":
        case "checkout.session.async_payment_succeeded":
        case "checkout.session.async_payment_failed":
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          if (checkoutSession.mode === "subscription") {
            const subscriptionId = checkoutSession.subscription as string;
            await manageSubscriptionStatusChange(
              subscriptionId,
              checkoutSession.customer as string,
              true
            );
          } else {
            const paymentIntentId = checkoutSession.payment_intent as string;
            const paymentIntent = await stripe.paymentIntents.retrieve(
              paymentIntentId
            );
            await insertPaymentRecord(paymentIntent, checkoutSession);
          }
          if (checkoutSession.tax_id_collection?.enabled) {
            const customersSnap = await db
              .collection(config.customersCollectionPath)
              .where("stripeId", "==", checkoutSession.customer as string)
              .get();
            if (customersSnap.size === 1) {
              customersSnap.docs[0].ref.set(
                checkoutSession.customer_details || {},
                {
                  merge: true,
                }
              );
            }
          }
          break;
        case "invoice.paid":
        case "invoice.payment_succeeded":
        case "invoice.payment_failed":
        case "invoice.upcoming":
        case "invoice.marked_uncollectible":
        case "invoice.payment_action_required":
          const invoice = event.data.object as Stripe.Invoice;
          await insertInvoiceRecord(invoice);
          break;
        case "payment_intent.processing":
        case "payment_intent.succeeded":
        case "payment_intent.canceled":
        case "payment_intent.payment_failed":
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          await insertPaymentRecord(paymentIntent);
          break;
        default:
          logs.webhookHandlerError(
            new Error("Unhandled relevant event!"),
            event.id,
            event.type
          );
      }

      logs.webhookHandlerSucceeded(event.id, event.type);
    } catch (error) {
      logs.webhookHandlerError(error as Error, event.id, event.type);
      resp.json({
        error: "Webhook handler failed. View function logs in Firebase.",
      });
      return;
    }
  }

  // Return a response to Stripe to acknowledge receipt of the event.
  resp.json({ received: true });
});
