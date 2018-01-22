'use strict';

exports.CURRENT_EVENT_SERIES_SCHEME_VERSION = 1;

exports.EVENT_SERIES_TYPE_SEASON = 'Season';
exports.EVENT_SERIES_TYPE_OCCASIONAL = 'Occasional';

exports.ALLOWED_EVENT_SERIES_TYPES = [
  exports.EVENT_SERIES_TYPE_SEASON,
  exports.EVENT_SERIES_TYPE_OCCASIONAL
];

exports.SUMMARY_EVENT_SERIES_PROJECTION_EXPRESSION = 'id, #s, #n, eventSeriesType, occurrence, summary, images';

exports.SUMMARY_EVENT_SERIES_PROJECTION_NAMES = {
  '#s': 'status',
  '#n': 'name'
};
