import "../xray-setup";
import withErrorHandling from "../with-error-handling";
import * as eventService from "../../event/event-service";
import convertAsyncToCallback from "../convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withErrorHandling(async function(event) {
    const result = await eventService.getEventMulti(event);
    return { body: JSON.stringify(result) };
  })
);
