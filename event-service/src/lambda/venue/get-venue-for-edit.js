import "../xray-setup";
import withErrorHandling from "../with-error-handling";
// import * as venueService from "../../venue/venue-service";
import convertAsyncToCallback from "../convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withErrorHandling(async function(event) {
    return { event };
    // const id = event.pathParameters.id;
    // const entity = await venueService.getVenueForEdit(id);
    // return { body: { entity } };
  })
);
