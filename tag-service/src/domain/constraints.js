import * as constants from "../constants";

const LABEL_FORMAT_REGEX = /[&\w àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ-]+/i;

export default {
  type: {
    inclusion: constants.ALLOWED_TAG_TYPES,
    presence: true
  },
  label: {
    format: LABEL_FORMAT_REGEX,
    presence: true,
    length: { minimum: 2, maximum: 50 }
  }
};
