import "../xray-setup";
import withErrorHandling from "../with-error-handling";
import * as talentService from "../../talent/talent-service";
import convertAsyncToCallback from "../convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withErrorHandling(
    // withCacheControl(
    async function(event) {
      const result = await talentService.getTalent(event);
      return { body: JSON.stringify(result) };
    }
    //)
  )
);
