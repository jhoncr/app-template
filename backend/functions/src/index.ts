import {addLogFn} from "./bg-add-log-entry";
import {createNewJournal} from "./bg-create-new-journal";
import {initializeApp, getApps} from "firebase-admin/app";
import {addContributer} from "./bg-add-contributors";
import {acceptShare} from "./bg-accept-share";
import {deleteEntry} from "./bg-delete-entry";

if ( getApps().length === 0 ) {
  initializeApp();
}

exports.addLogFn = addLogFn;
exports.createNewJournal = createNewJournal;
exports.addContributer = addContributer;
exports.acceptShare = acceptShare;
exports.deleteEntry = deleteEntry;
