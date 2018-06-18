import "../xray-setup";
import withErrorHandling from "../with-error-handling";
// import * as eventService from "../../event/event-service";
import convertAsyncToCallback from "../convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withErrorHandling(async function(event) {
    return { event };
    // const id = decodeURIComponent(event.pathParameters.id);
    // const entity = await eventService.getEventForEdit(id);
    // return { body: { entity } };
  })
);
