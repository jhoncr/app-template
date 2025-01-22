import { addLogFn } from "./journal-functions/bg-add-log-entry";
import { createNewJournal } from "./journal-functions/bg-create-new-journal";
import { initializeApp, getApps } from "firebase-admin/app";
import { addContributer } from "./journal-functions/bg-add-contributors";
import { acceptShare } from "./journal-functions/bg-accept-share";
import { deleteEntry } from "./journal-functions/bg-delete-entry";

import { createPortalLink } from "./stripe-functions/stripe-create-portallink";
import { handleWebhookEvents } from "./stripe-functions/stripe-webhook-handler";
import {
  createCheckoutSessionFn,
  createPaymentIntent,
} from "./stripe-functions/create-checkout-session-oncall";
import { createCheckoutSessionV2 } from "./stripe-functions/stripe-create-checkoutsessionV2";
// import { createCheckoutSessionV1 } from "./stripe-functions/onCreate-checkoutsession";
import {
  onTestDocumentCreated,
  handleTest,
} from "./stripe-functions/stripe-test";

//hande material ops:
import {
  createMaterial,
  getMaterials,
  updateMaterial,
  deleteMaterial,
} from "./quotes-fn/material-ops";

import {
  createQuote,
  getQuotes,
  updateQuote,
  deleteQuote,
  getQuote,
} from "./quotes-fn/quote-ops";

if (getApps().length === 0) {
  initializeApp();
}

exports.createCheckoutSessionFn = createCheckoutSessionFn;
exports.createPaymentIntent = createPaymentIntent;
exports.createCheckoutSession = createCheckoutSessionV2;

exports.addLogFn = addLogFn;
exports.createNewJournal = createNewJournal;
exports.addContributer = addContributer;
exports.acceptShare = acceptShare;
exports.deleteEntry = deleteEntry;

exports.createPortalLink = createPortalLink;
exports.handleWebhookEvents = handleWebhookEvents;

// only export handleTest in development mode
if (process.env.FUNCTIONS_EMULATOR) {
  console.log("Running in emulator mode, exporting handleTest");
  exports.handleTest = handleTest;
  exports.onTestDocumentCreated = onTestDocumentCreated;
}

exports.createMaterial = createMaterial;
exports.getMaterials = getMaterials;
exports.updateMaterial = updateMaterial;
exports.deleteMaterial = deleteMaterial;

exports.createQuote = createQuote;
exports.getQuotes = getQuotes;
exports.updateQuote = updateQuote;
exports.deleteQuote = deleteQuote;
exports.getQuote = getQuote;
