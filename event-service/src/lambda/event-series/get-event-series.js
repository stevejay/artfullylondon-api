import "../xray-setup";
import withErrorHandling from "../with-error-handling";
import * as eventSeriesService from "../../event-series/event-series-service";
import convertAsyncToCallback from "../convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withErrorHandling(
    //withCacheControl(
    async function(event) {
      const result = await eventSeriesService.getEventSeries(event);
      return { body: JSON.stringify(result) };
    } //)
  )
);
