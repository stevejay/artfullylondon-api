import "./xray-setup";
import withErrorHandling from "./with-error-handling";
import * as tagService from "../tag-service";
import convertAsyncToCallback from "./convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withErrorHandling(async function(event) {
    const result = await tagService.getTagsByType(event);
    return { body: JSON.stringify(result) };
  })
);
