import "../xray-setup";
import withErrorHandling from "../with-error-handling";
import withWriteAuthorization from "../with-write-authorization";
import * as eventSeriesService from "../../event-series-service";
import convertAsyncToCallback from "../convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withWriteAuthorization(
    withErrorHandling(async function(event) {
      const result = await eventSeriesService.createOrUpdateEventSeries({
        ...event.body,
        id: event.id
      });
      return { body: JSON.stringify(result) };
    })
  )
);
