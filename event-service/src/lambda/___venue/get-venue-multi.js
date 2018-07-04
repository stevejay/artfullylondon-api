import "../xray-setup";
import withErrorHandling from "../___with-error-handling";
import * as venueService from "../../venue-service";
import * as mapper from "../mapper";
import convertAsyncToCallback from "../convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withErrorHandling(async function(event) {
    const params = mapper.mapGetEntityMultiRequest(event);
    const result = await venueService.getMulti(params);
    return { body: JSON.stringify(result) };
  })
);
