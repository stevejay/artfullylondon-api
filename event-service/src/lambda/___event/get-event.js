import "../xray-setup";
import withErrorHandling from "../___with-error-handling";
import withCacheControl from "../___with-cache-control";
import * as eventService from "../../event-service";
import * as entityType from "../../types/entity-type";
import convertAsyncToCallback from "../convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withErrorHandling(
    withCacheControl(async function(event) {
      const result = await eventService.get(event);
      return { body: JSON.stringify(result) };
    }, entityType.EVENT)
  )
);