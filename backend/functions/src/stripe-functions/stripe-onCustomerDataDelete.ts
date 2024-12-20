import * as functions from "firebase-functions/v1";

import { stripe } from "./common";
import * as logs from "./logs";
// import * as admin from "firebase-admin";

import config from "./config";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { initializeApp, getApps } from "firebase-admin/app";

if (getApps().length === 0) {
  initializeApp();
}

const db = getFirestore();

const deleteStripeCustomer = async ({
  uid,
  stripeId,
}: {
  uid: string;
  stripeId: string;
}) => {
  try {
    // Delete their customer object.
    // Deleting the customer object will immediately cancel all their active subscriptions.
    await stripe.customers.del(stripeId);
    logs.customerDeleted(stripeId);
    // Mark all their subscriptions as cancelled in Firestore.
    const update = {
      status: "canceled",
      ended_at: Timestamp.now(),
    };
    // Set all subscription records to canceled.
    const subscriptionsSnap = await db
      .collection(config.customersCollectionPath)
      .doc(uid)
      .collection("subscriptions")
      .where("status", "in", ["trialing", "active"])
      .get();
    subscriptionsSnap.forEach((doc) => {
      doc.ref.set(update, { merge: true });
    });
  } catch (error) {
    logs.customerDeletionError(error as Error, uid);
  }
};

/*
 * The `onUserDeleted` deletes their customer object in Stripe which immediately cancels all their subscriptions.
 */
// export const onUserDeleted = functions.auth.user().onDelete(async (user) => {
export const onUserDeleted = functions.auth.user().onDelete(async (user) => {
  if (!config.autoDeleteUsers) return;
  // Get the Stripe customer id.
  const customer = (
    await db.collection(config.customersCollectionPath).doc(user.uid).get()
  ).data();
  // If you use the `delete-user-data` extension it could be the case that the customer record is already deleted.
  // In that case, the `onCustomerDataDeleted` function below takes care of deleting the Stripe customer object.
  if (customer) {
    await deleteStripeCustomer({ uid: user.uid, stripeId: customer.stripeId });
  }
});

/*
 * The `onCustomerDataDeleted` deletes their customer object in Stripe which immediately cancels all their subscriptions.
 */
export const onCustomerDataDeleted = functions.firestore
  .document(`/${config.customersCollectionPath}/{uid}`)
  .onDelete(async (snap, context) => {
    if (!config.autoDeleteUsers) return;
    const { stripeId } = snap.data();
    await deleteStripeCustomer({ uid: context.params.uid, stripeId });
  });
