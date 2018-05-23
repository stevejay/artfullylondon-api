'use strict';

exports.CURRENT_TALENT_SCHEME_VERSION = 2;

exports.TALENT_TYPE_INDIVIDUAL = 'Individual';
exports.TALENT_TYPE_GROUP = 'Group';

exports.ALLOWED_TALENT_TYPES = [
  exports.TALENT_TYPE_INDIVIDUAL,
  exports.TALENT_TYPE_GROUP
];

exports.SUMMARY_TALENT_PROJECTION_EXPRESSION = 'id, #s, firstNames, lastName, talentType, commonRole, images';

exports.SUMMARY_TALENT_PROJECTION_NAMES = {
  '#s': 'status'
};
