import "../xray-setup";
import withErrorHandling from "../with-error-handling";
import withWriteAuthorization from "../with-write-authorization";
// import * as eventService from "../../event/event-service";
import convertAsyncToCallback from "../convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withWriteAuthorization(
    withErrorHandling(async function(event) {
      return { event };
      // const request = JSON.parse(event.body);
      // const pathId =
      //   event.pathParameters && event.pathParameters.id
      //     ? decodeURIComponent(event.pathParameters.id)
      //     : null;
      // const entity = await eventService.createOrUpdateEvent(event);
      // return { body: { entity } };
    })
  )
);
