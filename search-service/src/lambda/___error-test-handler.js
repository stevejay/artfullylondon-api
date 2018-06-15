import "./xray-setup";
// import withErrorHandling from "lambda-error-handler";
// import * as searchService from "../search-service";
import convertAsyncToCallback from "./convert-async-to-callback";

export const handler = convertAsyncToCallback(async function(event) {
  if (event.status !== 200 && event.status !== "200") {
    throw new Error(`[${event.status}] Some error`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ foo: "bar", ...event }),
    headers: {
      //"Cache-Control": "public, max-age=1234"
    }
  };
});
