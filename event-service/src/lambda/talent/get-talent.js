import "../xray-setup";
import withErrorHandling from "../with-error-handling";
import withCacheControl from "../with-cache-control";
import * as talentService from "../../talent/talent-service";
import * as entityType from "../../types/entity-type";
import convertAsyncToCallback from "../convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withErrorHandling(
    withCacheControl(async function(event) {
      const result = await talentService.getTalent(event);
      return { body: JSON.stringify(result) };
    }, entityType.TALENT)
  )
);
