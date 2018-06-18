import "../xray-setup";
import withErrorHandling from "../with-error-handling";
import withWriteAuthorization from "../with-write-authorization";
// import * as venueService from "../../venue/venue-service";
import convertAsyncToCallback from "../convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withWriteAuthorization(
    withErrorHandling(async function(event) {
      return { event };
      // const request = JSON.parse(event.body);
      // const pathId = event.pathParameters && event.pathParameters.id;
      // const entity = await venueService.createOrUpdateVenue(pathId, request);
      // return { body: { entity } };
    })
  )
);
