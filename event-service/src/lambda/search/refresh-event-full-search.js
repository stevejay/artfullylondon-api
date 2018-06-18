import "../xray-setup";
import withErrorHandling from "../with-error-handling";
// import * as searchIndexService from "../../search/search-index-service";
import convertAsyncToCallback from "../convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withErrorHandling(async function(event) {
    return { event };
    // const request = { index: "event-full", version: "latest" };
    // await searchIndexService.refreshSearchIndex(request);
    // return { body: { acknowledged: true } };
  })
);
