import "./xray-setup";
import withErrorHandling from "./with-error-handling";
import * as imageService from "../image-service";
import convertAsyncToCallback from "./convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withErrorHandling(async function(event) {
    const result = await imageService.getImageData(event);
    return { body: JSON.stringify(result) };
  })
);
