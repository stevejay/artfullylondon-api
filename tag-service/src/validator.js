import { ensure } from "ensure-request";
import * as tagType from "./tag-type";

const typeConstraint = {
  inclusion: tagType.ALLOWED_TAG_TYPES,
  presence: true
};

const labelConstraint = {
  format: /[&\w àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ-]+/i,
  presence: true,
  length: { minimum: 2, maximum: 50 }
};

function errorHandler(errors) {
  throw new Error("[400] Bad Request: " + errors.join("; "));
}

export function validateGetTagsByTypeRequest(request) {
  ensure(request, { type: typeConstraint }, errorHandler);
}

export function validateCreateTagRequest(request) {
  ensure(
    request,
    {
      type: typeConstraint,
      label: labelConstraint
    },
    errorHandler
  );
}
