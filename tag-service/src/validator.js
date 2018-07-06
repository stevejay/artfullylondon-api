import { ensure } from "ensure-request";

const CREATE_TAG_CONSTRAINT = {
  label: {
    format: /[&\w àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ-]+/i,
    presence: true,
    length: { minimum: 2, maximum: 50 }
  }
};

function errorHandler(errors) {
  throw new Error("[400] Bad Request: " + errors.join("; "));
}

export function validateCreateTagRequest(request) {
  ensure(request, CREATE_TAG_CONSTRAINT, errorHandler);
}
