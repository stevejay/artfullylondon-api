import "../xray-setup";
import withErrorHandling from "../with-error-handling";
import withCacheControl from "../with-cache-control";
import * as eventSeriesService from "../../event-series/event-series-service";
import * as entityType from "../../types/entity-type";
import convertAsyncToCallback from "../convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withErrorHandling(
    withCacheControl(async function(event) {
      const result = await eventSeriesService.getEventSeries(event);
      return { body: JSON.stringify(result) };
    }, entityType.EVENT_SERIES)
  )
);
