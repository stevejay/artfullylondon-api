'use strict';

exports.EMAIL_FREQUENCY_TYPE_DAILY = 'Daily';
exports.EMAIL_FREQUENCY_TYPE_WEEKLY = 'Weekly';
exports.EMAIL_FREQUENCY_TYPE_NO_EMAILS = 'NoEmails';

exports.ALLOWED_EMAIL_FREQUENCY_TYPES = [
  exports.EMAIL_FREQUENCY_TYPE_DAILY,
  exports.EMAIL_FREQUENCY_TYPE_WEEKLY,
  exports.EMAIL_FREQUENCY_TYPE_NO_EMAILS,
];

exports.ENTITY_TYPE_TAG = 'tag';
exports.ENTITY_TYPE_TALENT = 'talent';
exports.ENTITY_TYPE_VENUE = 'venue';
exports.ENTITY_TYPE_EVENT = 'event';
exports.ENTITY_TYPE_EVENT_SERIES = 'event-series';

exports.ALLOWED_ENTITY_TYPES = [
  exports.ENTITY_TYPE_TAG,
  exports.ENTITY_TYPE_TALENT,
  exports.ENTITY_TYPE_VENUE,
  exports.ENTITY_TYPE_EVENT,
  exports.ENTITY_TYPE_EVENT_SERIES,
];

exports.WATCH_CHANGE_TYPE_ADD = 'add';
exports.WATCH_CHANGE_TYPE_DELETE = 'delete';

exports.ALLOWED_WATCH_CHANGE_TYPES = [
  exports.WATCH_CHANGE_TYPE_ADD,
  exports.WATCH_CHANGE_TYPE_DELETE,
];

exports.MAX_WATCHES_LENGTH = 200;
exports.INITIAL_VERSION_NUMBER = 0;