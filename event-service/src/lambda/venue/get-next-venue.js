import "../xray-setup";
import withErrorHandling from "../with-error-handling";
import * as venueService from "../../venue/venue-service";
import convertAsyncToCallback from "../convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withErrorHandling(async function(event) {
    const result = await venueService.getNextVenue(event);
    return { body: JSON.stringify(result) };
  })
);
