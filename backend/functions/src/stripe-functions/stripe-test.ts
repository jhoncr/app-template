import { onRequest, Request } from "firebase-functions/v2/https";
import config from "./config";
import * as logs from "./logs";
import { onDocumentCreated } from "firebase-functions/v2/firestore";

/**
 * A webhook handler function for the relevant test events.
 */
export const handleTest = onRequest(async (req: Request, resp) => {
  logs.info("config", config);

  resp.send("Test webhook received");
});

/**
 * A Firestore trigger function for the /test collection.
 */
export const onTestDocumentCreated = onDocumentCreated(
  "/test/{docId}",
  async (event) => {
    const newValue = event.data;
    logs.info("New document created in /test collection", newValue);

    // add the property "processed": currentTime to the document
    await event.data?.ref.set(
      {
        processed: new Date().toISOString(),
      },
      { merge: true }
    );

    logs.info("Document updated with processed timestamp");
  }
);
