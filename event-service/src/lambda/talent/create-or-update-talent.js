import "../xray-setup";
import withErrorHandling from "../with-error-handling";
import withWriteAuthorization from "../with-write-authorization";
import * as talentService from "../../talent-service";
import convertAsyncToCallback from "../convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withWriteAuthorization(
    withErrorHandling(async function(event) {
      const result = await talentService.createOrUpdateTalent({
        ...event.body,
        id: event.id
      });
      return { body: JSON.stringify(result) };
    })
  )
);
