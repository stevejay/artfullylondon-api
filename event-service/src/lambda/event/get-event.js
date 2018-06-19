import "../xray-setup";
import withErrorHandling from "../with-error-handling";
import * as eventService from "../../event/event-service";
import convertAsyncToCallback from "../convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withErrorHandling(
    // withCacheControl(
    async function(event) {
      const result = await eventService.getEvent(event);
      return { body: JSON.stringify(result) };
    }
    //)
  )
);
