import "../xray-setup";
import withErrorHandling from "../with-error-handling";
import * as eventService from "../../event-service";
import convertAsyncToCallback from "../convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withErrorHandling(async function(event) {
    const result = await eventService.getEventForEdit(event);
    return { body: JSON.stringify(result) };
  })
);
