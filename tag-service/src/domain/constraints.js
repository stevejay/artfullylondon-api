'use strict';

const constants = require('../constants');

const LABEL_FORMAT_REGEX = /[&\w àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ-]+/i;

const tagConstraint = {
  inclusion: constants.ALLOWED_TAG_TYPES,
  presence: true,
};

const labelConstraint = {
  format: LABEL_FORMAT_REGEX,
  presence: true,
  length: { minimum: 2, maximum: 50 },
};

module.exports = {
  type: tagConstraint,
  label: labelConstraint,
};
