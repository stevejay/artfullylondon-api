import "./xray-setup";
import withErrorHandling from "./with-error-handling";
import withWriteAuthorization from "./with-write-authorization";
import * as tagService from "../tag-service";
import convertAsyncToCallback from "./convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withWriteAuthorization(
    withErrorHandling(async function(event) {
      const result = await tagService.deleteTag(event);
      return { body: JSON.stringify(result) };
    })
  )
);
