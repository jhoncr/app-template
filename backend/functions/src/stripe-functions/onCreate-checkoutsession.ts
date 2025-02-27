// import * as logs from "./logs";
// import * as functions from "firebase-functions";
// import config from "./config";
// import { stripe, createCustomerRecord, apiVersion } from "./common";
// import { getFirestore, Timestamp } from "firebase-admin/firestore";
// import { initializeApp, getApps } from "firebase-admin/app";
// import { getAuth } from "firebase-admin/auth";
// import { Stripe } from "stripe";
// import { CustomerData } from "./interfaces";

// if (getApps().length === 0) {
//   initializeApp();
// }

// const db = getFirestore();

// export const createCheckoutSessionV1 = functions
//   .runWith({
//     minInstances: config.minCheckoutInstances,
//   })
//   .firestore.document(
//     `/${config.customersCollectionPath}/{uid}/checkout_sessions/{id}`
//   )
//   .onCreate(async (snap, context) => {
//     if (!snap) {
//       logs.checkoutSessionCreationError(
//         context.params.id,
//         new Error("No data")
//       );
//       return;
//     }

//     const {
//       client = "web",
//       amount,
//       currency,
//       mode = "subscription",
//       price,
//       success_url,
//       cancel_url,
//       quantity = 1,
//       payment_method_types,
//       shipping_rates = [],
//       metadata = {},
//       automatic_payment_methods = { enabled: true },
//       automatic_tax = false,
//       invoice_creation = false,
//       tax_rates = [],
//       tax_id_collection = false,
//       allow_promotion_codes = false,
//       trial_period_days,
//       line_items,
//       billing_address_collection = "required",
//       collect_shipping_address = false,
//       customer_update = {},
//       locale = "auto",
//       promotion_code,
//       client_reference_id,
//       setup_future_usage,
//       after_expiration = {},
//       consent_collection = {},
//       expires_at,
//       phone_number_collection = {},
//       payment_method_collection = "always",
//     } = snap.data();

//     try {
//       logs.creatingCheckoutSession(context.params.id);
//       // Get stripe customer id
//       let customerRecord: CustomerData | null = null;
//       if (snap.ref.parent && snap.ref.parent.parent) {
//         customerRecord = (
//           await snap.ref.parent.parent.get()
//         ).data() as CustomerData;
//       }
//       if (!customerRecord?.stripeId) {
//         const { email, phoneNumber } = await getAuth().getUser(
//           context.params.uid
//         );

//         customerRecord = await createCustomerRecord({
//           uid: context.params.uid,
//           email,
//           phone: phoneNumber,
//         });
//       }
//       if (!customerRecord?.stripeId) {
//         throw new Error("Could not create a customer record");
//       }
//       const customer = customerRecord.stripeId;

//       if (client === "web") {
//         // Get shipping countries
//         const shippingCountries: Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[] =
//           collect_shipping_address
//             ? (
//                 await db
//                   .collection(config.productsCollectionPath)
//                   .doc("shipping_countries")
//                   .get()
//               ).data()?.["allowed_countries"] ?? []
//             : [];
//         const sessionCreateParams: Stripe.Checkout.SessionCreateParams = {
//           billing_address_collection,
//           shipping_address_collection: { allowed_countries: shippingCountries },
//           shipping_rates,
//           customer,
//           customer_update,
//           line_items: line_items
//             ? line_items
//             : [
//                 {
//                   price,
//                   quantity,
//                 },
//               ],
//           mode,
//           success_url,
//           cancel_url,
//           locale,
//           after_expiration,
//           consent_collection,
//           phone_number_collection,
//           ...(expires_at && { expires_at }),
//         };
//         if (payment_method_types) {
//           sessionCreateParams.payment_method_types = payment_method_types;
//         }
//         if (mode === "subscription") {
//           sessionCreateParams.payment_method_collection =
//             payment_method_collection;
//           sessionCreateParams.subscription_data = {
//             metadata,
//           };
//           if (trial_period_days) {
//             sessionCreateParams.subscription_data.trial_period_days =
//               trial_period_days;
//           }
//           if (!automatic_tax) {
//             sessionCreateParams.subscription_data.default_tax_rates = tax_rates;
//           }
//         } else if (mode === "payment") {
//           sessionCreateParams.payment_intent_data = {
//             metadata,
//             ...(setup_future_usage && { setup_future_usage }),
//           };
//           if (invoice_creation) {
//             sessionCreateParams.invoice_creation = {
//               enabled: true,
//             };
//           }
//         }
//         if (automatic_tax) {
//           sessionCreateParams.automatic_tax = {
//             enabled: true,
//           };
//           sessionCreateParams.customer_update =
//             sessionCreateParams.customer_update || {};
//           sessionCreateParams.customer_update.name = "auto";
//           sessionCreateParams.customer_update.address = "auto";
//           sessionCreateParams.customer_update.shipping = "auto";
//         }
//         if (tax_id_collection) {
//           sessionCreateParams.tax_id_collection = {
//             enabled: true,
//           };
//           sessionCreateParams.customer_update =
//             sessionCreateParams.customer_update || {};
//           sessionCreateParams.customer_update.name = "auto";
//           sessionCreateParams.customer_update.address = "auto";
//           sessionCreateParams.customer_update.shipping = "auto";
//         }
//         if (promotion_code) {
//           sessionCreateParams.discounts = [{ promotion_code }];
//         } else {
//           sessionCreateParams.allow_promotion_codes = allow_promotion_codes;
//         }
//         if (client_reference_id)
//           sessionCreateParams.client_reference_id = client_reference_id;
//         const session = await stripe.checkout.sessions.create(
//           sessionCreateParams,
//           { idempotencyKey: context.params.id }
//         );
//         await snap.ref.set(
//           {
//             client,
//             mode,
//             sessionId: session.id,
//             url: session.url,
//             created: Timestamp.now(),
//           },
//           { merge: true }
//         );
//       } else if (client === "mobile") {
//         let paymentIntentClientSecret = null;
//         let setupIntentClientSecret = null;
//         if (mode === "payment") {
//           if (!amount || !currency) {
//             throw new Error(
//               `When using 'client:mobile' and 'mode:payment' you must specify amount and currency!`
//             );
//           }
//           const paymentIntentCreateParams: Stripe.PaymentIntentCreateParams = {
//             amount,
//             currency,
//             customer,
//             metadata,
//             ...(setup_future_usage && { setup_future_usage }),
//           };
//           if (payment_method_types) {
//             paymentIntentCreateParams.payment_method_types =
//               payment_method_types;
//           } else {
//             paymentIntentCreateParams.automatic_payment_methods =
//               automatic_payment_methods;
//           }
//           const paymentIntent = await stripe.paymentIntents.create(
//             paymentIntentCreateParams
//           );
//           paymentIntentClientSecret = paymentIntent.client_secret;
//         } else if (mode === "setup") {
//           const setupIntent = await stripe.setupIntents.create({
//             customer,
//             metadata,
//             payment_method_types: payment_method_types ?? ["card"],
//           });
//           setupIntentClientSecret = setupIntent.client_secret;
//         } else if (mode === "subscription") {
//           const subscription = await stripe.subscriptions.create({
//             customer,
//             items: [{ price }],
//             trial_period_days: trial_period_days,
//             payment_behavior: "default_incomplete",
//             expand: ["latest_invoice.payment_intent"],
//             metadata: {
//               firebaseUserUID: context.params.id,
//             },
//           });

//           paymentIntentClientSecret =
//             //@ts-ignore
//             subscription.latest_invoice.payment_intent.client_secret;
//         } else {
//           throw new Error(
//             `Mode '${mode} is not supported for 'client:mobile'!`
//           );
//         }
//         const ephemeralKey = await stripe.ephemeralKeys.create(
//           { customer },
//           { apiVersion }
//         );
//         await snap.ref.set(
//           {
//             client,
//             mode,
//             customer,
//             created: Timestamp.now(),
//             ephemeralKeySecret: ephemeralKey.secret,
//             paymentIntentClientSecret,
//             setupIntentClientSecret,
//           },
//           { merge: true }
//         );
//       } else {
//         throw new Error(
//           `Client ${client} is not supported. Only 'web' or ' mobile' is supported!`
//         );
//       }
//       logs.checkoutSessionCreated(context.params.id);
//       return;
//     } catch (error) {
//       logs.checkoutSessionCreationError(context.params.id, error as Error);
//       await snap.ref.set(
//         { error: { message: (error as Error).message } },
//         { merge: true }
//       );
//     }
//   });
