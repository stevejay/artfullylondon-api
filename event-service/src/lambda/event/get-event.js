import "../xray-setup";
import withErrorHandling from "../with-error-handling";
// import * as eventService from "../../event/event-service";
import convertAsyncToCallback from "../convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withErrorHandling(
    // withCacheControl(
    async function(event) {
      return { event };
      // const id = decodeURIComponent(event.pathParameters.id);
      // const entity = await eventService.getEvent(id);
      // return { entity };
    }
    //)
  )
);
