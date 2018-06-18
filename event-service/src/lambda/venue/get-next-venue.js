import "../xray-setup";
import withErrorHandling from "../with-error-handling";
// import * as venueService from "../../venue/venue-service";
import convertAsyncToCallback from "../convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withErrorHandling(async function(event) {
    return { event };
    //   const lastId =
    //   event.pathParameters && event.pathParameters.lastId
    //     ? event.pathParameters.lastId
    //     : event.lastId;

    // const result = await venueService.getNextVenue(lastId || null);
    // return { body: { venueId: result.Items.length ? result.Items[0].id : null } };
  })
);
