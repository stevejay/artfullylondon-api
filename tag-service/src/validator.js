import { ensure } from "ensure-request";
import * as tagType from "./tag-type";

const CREATE_TAG_CONSTRAINT = {
  tagType: {
    inclusion: tagType.ALLOWED_TAG_TYPES,
    presence: true
  },
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

export function validateUserForMutation(context) {
  if (!context.authorizer.isEditor) {
    throw new Error("[401] User not authorized for requested action");
  }
}
