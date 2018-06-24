import "../xray-setup";
import withErrorHandling from "../with-error-handling";
import * as talentService from "../../talent-service";
import convertAsyncToCallback from "../convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withErrorHandling(async function(event) {
    const result = await talentService.getForEdit(event);
    return { body: JSON.stringify(result) };
  })
);
