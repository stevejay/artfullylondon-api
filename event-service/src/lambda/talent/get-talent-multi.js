import "../xray-setup";
import withErrorHandling from "../with-error-handling";
// import * as talentService from "../../talent/talent-service";
import convertAsyncToCallback from "../convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withErrorHandling(async function(event) {
    return { event };
    //   const ids =
    //   event.queryStringParameters && event.queryStringParameters.ids
    //     ? decodeURIComponent(event.queryStringParameters.ids).split(",")
    //     : JSON.parse(event.body).ids;

    // const entities = await talentService.getTalentMulti(ids);
    // return { body: { entities } };
  })
);
