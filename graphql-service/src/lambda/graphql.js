import "./xray-setup";
import withErrorHandling from "./with-error-handling";
import convertAsyncToCallback from "./convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withErrorHandling(async function(event) {
    return { body: JSON.stringify({ foo: "bar" }) };
  })
);
