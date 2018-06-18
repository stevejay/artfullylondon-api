import "./xray-setup";
import withErrorHandling from "./with-error-handling";
import * as watchService from "../watch-service";
import convertAsyncToCallback from "./convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withErrorHandling(async function(event) {
    const result = await watchService.updateWatches(event);
    return { body: JSON.stringify(result) };
  })
);
