import "../xray-setup";
import withErrorHandling from "../___with-error-handling";
import * as eventSeriesService from "../../event-series-service";
import convertAsyncToCallback from "../convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withErrorHandling(async function(event) {
    const result = await eventSeriesService.getForEdit(event);
    return { body: JSON.stringify(result) };
  })
);