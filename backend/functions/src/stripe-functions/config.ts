// load the environment variables in backend/functions/.env.dev

export default {
  stripeSecretKey: process.env.STRIPE_API_KEY as string,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET as string,
  productsCollectionPath: process.env.PRODUCTS_COLLECTION as string,
  customersCollectionPath: process.env.CUSTOMERS_COLLECTION as string,
  syncUsersOnCreate: process.env.SYNC_USERS_ON_CREATE === ("Sync" as string),
  autoDeleteUsers:
    process.env.DELETE_STRIPE_CUSTOMERS === ("Auto delete" as string),
  minCheckoutInstances:
    Number(process.env.CREATE_CHECKOUT_SESSION_MIN_INSTANCES) ?? 0,
  successUrl: process.env.SUCCESS_URL as string,
  cancelUrl: process.env.CANCEL_URL as string,
  embbededUrl: process.env.EMBEDDED_URL as string,
  playTokenCollectionPath: process.env.PLAY_TOKEN_COLLECTION as string,
};
