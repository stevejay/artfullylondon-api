import "./xray-setup";
import withErrorHandling from "./with-error-handling";
import * as userService from "../user-service";
import convertAsyncToCallback from "./convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withErrorHandling(async function(event) {
    const result = await userService.getUser(event);
    return { body: JSON.stringify(result) };
  })
);
