import "../xray-setup";
import withErrorHandling from "../with-error-handling";
// import * as eventSeriesService from "../../event-series/event-series-service";
import convertAsyncToCallback from "../convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withErrorHandling(async function(event) {
    return { event };
    // const id = event.pathParameters.id;
    // const entity = await eventSeriesService.getEventSeriesForEdit(id);
    // return { body: { entity } };
  })
);
