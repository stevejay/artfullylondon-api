import "../xray-setup";
import withErrorHandling from "../___with-error-handling";
import withWriteAuthorization from "../___with-write-authorization";
import * as searchIndexService from "../../search-index-service";
import convertAsyncToCallback from "../convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withWriteAuthorization(
    withErrorHandling(async function(event) {
      const result = await searchIndexService.refreshSearchIndex(event);
      return { body: JSON.stringify(result) };
    })
  )
);
