import "./xray-setup";
import withErrorHandling from "./with-error-handling";
import * as preferenceService from "../preference-service";
import convertAsyncToCallback from "./convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withErrorHandling(async function(event) {
    const result = await preferenceService.getPreferences(event);
    return { body: JSON.stringify(result) };
  })
);
