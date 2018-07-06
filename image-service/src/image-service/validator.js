import { ensure } from "ensure-request";
import * as imageType from "../image-type";

const IMAGE_VALIDATOR = {
  type: {
    inclusion: imageType.ALLOWED_VALUES
  },
  id: {
    uuid: true,
    presence: true
  },
  url: {
    url: true,
    length: { maximum: 400 }
  }
};

function errorHandler(errors) {
  throw new Error("[400] Bad Request: " + errors.join("; "));
}

export function validateAddImageRequest(request) {
  ensure(request, IMAGE_VALIDATOR, errorHandler);
}
