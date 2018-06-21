import "../xray-setup";
import withErrorHandling from "../with-error-handling";
import * as eventService from "../../event-service";
import * as mapper from "../mapper";
import convertAsyncToCallback from "../convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withErrorHandling(async function(event) {
    const params = mapper.mapGetEntityMultiRequest(event);
    const result = await eventService.getEventMulti(params);
    return { body: JSON.stringify(result) };
  })
);
