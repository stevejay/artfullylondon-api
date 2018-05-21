'use strict';

const constants = require('../constants');

const idConstraint = {
  presence: true,
  string: true,
  length: { minimum: 1, maximum: 300 },
};

const labelConstraint = {
  string: true,
  length: { minimum: 1, maximum: 300 },
};

const createdConstraint = {
  number: true,
  numericality: { onlyInteger: true, greaterThan: 0 },
};

const entityTypeConstraint = {
  presence: true,
  inclusion: constants.ALLOWED_ENTITY_TYPES,
};

const changeTypeConstraint = {
  presence: true,
  inclusion: constants.ALLOWED_WATCH_CHANGE_TYPES,
  dependency: {
    test: value => value === constants.WATCH_CHANGE_TYPE_ADD,
    ensure: (_, attrs) => !!attrs.label && attrs.created > 0,
    message: 'label and created cannot be blank when changeType is "add"',
  },
};

const versionConstraint = {
  presence: true,
  number: true,
  numericality: { onlyInteger: true, greaterThan: 0 },
};

module.exports = {
  entityType: entityTypeConstraint,
  version: versionConstraint,
  changeType: changeTypeConstraint,
  id: idConstraint,
  label: labelConstraint,
  created: createdConstraint,
};
