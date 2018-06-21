import "../xray-setup";
import withErrorHandling from "../with-error-handling";
import * as searchIndexService from "../../search-index-service";
import convertAsyncToCallback from "../convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withErrorHandling(async function() {
    const result = await searchIndexService.refreshSearchIndex({
      index: "event",
      version: "latest"
    });
    return { body: JSON.stringify(result) };
  })
);
