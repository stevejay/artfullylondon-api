import "../xray-setup";
import withErrorHandling from "../with-error-handling";
import withWriteAuthorization from "../with-write-authorization";
import * as venueService from "../../venue-service";
import convertAsyncToCallback from "../convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withWriteAuthorization(
    withErrorHandling(async function(event) {
      const result = await venueService.createOrUpdateVenue({
        ...event.body,
        id: event.id
      });
      return { body: JSON.stringify(result) };
    })
  )
);
