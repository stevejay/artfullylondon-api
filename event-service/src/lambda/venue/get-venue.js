import "../xray-setup";
import withErrorHandling from "../with-error-handling";
import withCacheControl from "../with-cache-control";
import * as venueService from "../../venue/venue-service";
import * as entityType from "../../types/entity-type";
import convertAsyncToCallback from "../convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withErrorHandling(
    withCacheControl(async function(event) {
      const result = await venueService.getVenue(event);
      return { body: JSON.stringify(result) };
    }, entityType.VENUE)
  )
);
