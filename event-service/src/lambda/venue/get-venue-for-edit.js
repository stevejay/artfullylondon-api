import "../xray-setup";
import withErrorHandling from "../with-error-handling";
import * as venueService from "../../venue-service";
import convertAsyncToCallback from "../convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withErrorHandling(async function(event) {
    const result = await venueService.getForEdit(event);
    return { body: JSON.stringify(result) };
  })
);
