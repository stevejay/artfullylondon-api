import "../xray-setup";
import withErrorHandling from "../with-error-handling";
import withWriteAuthorization from "../with-write-authorization";
// import * as searchIndexService from "../../search/search-index-service";
import convertAsyncToCallback from "../convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withWriteAuthorization(
    withErrorHandling(async function(event) {
      return { event };
      // const request = {
      //   index: event.pathParameters.index,
      //   version: event.pathParameters.version
      // };

      // await searchIndexService.refreshSearchIndex(request);
      // return { body: { acknowledged: true } };
    })
  )
);
