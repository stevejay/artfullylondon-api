import "../xray-setup";
import withErrorHandling from "../with-error-handling";
// import * as talentService from "../../talent/talent-service";
import convertAsyncToCallback from "../convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withErrorHandling(async function(event) {
    return { event };
    // const id = event.pathParameters.id;
    // const entity = await talentService.getTalentForEdit(id);
    // return { body: { entity } };
  })
);
