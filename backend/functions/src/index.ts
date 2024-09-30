import { addLogFn } from "./journal-functions/bg-add-log-entry";
import { createNewJournal } from "./journal-functions/bg-create-new-journal";
import { initializeApp, getApps } from "firebase-admin/app";
import { addContributer } from "./journal-functions/bg-add-contributors";
import { acceptShare } from "./journal-functions/bg-accept-share";
import { deleteEntry } from "./journal-functions/bg-delete-entry";

import { createPortalLink } from "./stripe-functions/stripe-create-portallink";
import { handleWebhookEvents } from "./stripe-functions/stripe-webhook-handler";

if (getApps().length === 0) {
  initializeApp();
}

exports.addLogFn = addLogFn;
exports.createNewJournal = createNewJournal;
exports.addContributer = addContributer;
exports.acceptShare = acceptShare;
exports.deleteEntry = deleteEntry;

exports.createPortalLink = createPortalLink;
exports.handleWebhookEvents = handleWebhookEvents;
