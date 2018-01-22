'use strict';

exports.DATE_FORMAT = 'YYYY/MM/DD';

exports.SEARCH_RESULTS_DEFAULT_PAGE_SIZE = 12;
exports.AUTOCOMPLETE_MAX_RESULTS = 5;
exports.AUTOCOMPLETE_COMBINED_MAX_RESULTS = 6;
exports.FULLSEARCH_COMBINED_MAX_RESULTS = 15;

exports.STATUS_TYPE_PENDING = 'Pending';
exports.STATUS_TYPE_ACTIVE = 'Active';
exports.STATUS_TYPE_DELETED = 'Deleted';
exports.STATUS_TYPE_MERGED = 'Merged';

exports.ALLOWED_STATUS_TYPES = [
  exports.STATUS_TYPE_PENDING,
  exports.STATUS_TYPE_ACTIVE,
  exports.STATUS_TYPE_DELETED,
  exports.STATUS_TYPE_MERGED,
];

exports.ENTITY_TYPE_TALENT = 'talent';
exports.ENTITY_TYPE_VENUE = 'venue';
exports.ENTITY_TYPE_EVENT = 'event';
exports.ENTITY_TYPE_EVENT_SERIES = 'event-series';
exports.ENTITY_TYPE_ALL = 'all';

exports.ALLOWED_ENTITY_TYPES = [
  exports.ENTITY_TYPE_TALENT,
  exports.ENTITY_TYPE_VENUE,
  exports.ENTITY_TYPE_EVENT,
  exports.ENTITY_TYPE_EVENT_SERIES,
  exports.ENTITY_TYPE_ALL,
];

exports.SEARCH_INDEX_TYPE_TALENT_FULL = 'talent-full';
exports.SEARCH_INDEX_TYPE_TALENT_AUTO = 'talent-auto';
exports.SEARCH_INDEX_TYPE_VENUE_FULL = 'venue-full';
exports.SEARCH_INDEX_TYPE_VENUE_AUTO = 'venue-auto';
exports.SEARCH_INDEX_TYPE_EVENT_SERIES_FULL = 'event-series-full';
exports.SEARCH_INDEX_TYPE_EVENT_SERIES_AUTO = 'event-series-auto';
exports.SEARCH_INDEX_TYPE_EVENT_FULL = 'event-full';
exports.SEARCH_INDEX_TYPE_COMBINED_EVENT_AUTO = 'combined-event-auto';

exports.ALLOWED_SEARCH_INDEX_TYPES = [
  exports.SEARCH_INDEX_TYPE_TALENT_FULL,
  exports.SEARCH_INDEX_TYPE_TALENT_AUTO,
  exports.SEARCH_INDEX_TYPE_VENUE_FULL,
  exports.SEARCH_INDEX_TYPE_VENUE_AUTO,
  exports.SEARCH_INDEX_TYPE_EVENT_SERIES_FULL,
  exports.SEARCH_INDEX_TYPE_EVENT_SERIES_AUTO,
  exports.SEARCH_INDEX_TYPE_EVENT_FULL,
  exports.SEARCH_INDEX_TYPE_COMBINED_EVENT_AUTO,
];

exports.EVENT_TYPE_PERFORMANCE = 'Performance';
exports.EVENT_TYPE_EXHIBITION = 'Exhibition';
exports.EVENT_TYPE_COURSE = 'Course';

exports.ALLOWED_EVENT_TYPES = [
  exports.EVENT_TYPE_PERFORMANCE,
  exports.EVENT_TYPE_EXHIBITION,
  exports.EVENT_TYPE_COURSE,
];

exports.COST_TYPE_FREE = 'Free';
exports.COST_TYPE_PAID = 'Paid';

exports.ALLOWED_COST_TYPES = [exports.COST_TYPE_FREE, exports.COST_TYPE_PAID];

exports.AREA_TYPE_CENTRAL = 'Central';
exports.AREA_TYPE_EAST = 'East';
exports.AREA_TYPE_WEST = 'West';
exports.AREA_TYPE_NORTH = 'North';
exports.AREA_TYPE_SOUTH_EAST = 'SouthEast';
exports.AREA_TYPE_SOUTH_WEST = 'SouthWest';

exports.ALLOWED_AREA_TYPES = [
  exports.AREA_TYPE_CENTRAL,
  exports.AREA_TYPE_EAST,
  exports.AREA_TYPE_WEST,
  exports.AREA_TYPE_NORTH,
  exports.AREA_TYPE_SOUTH_EAST,
  exports.AREA_TYPE_SOUTH_WEST,
];

exports.COST_TYPE_FREE = 'Free';
exports.COST_TYPE_PAID = 'Paid';

exports.ALLOWED_COST_TYPES = [exports.COST_TYPE_FREE, exports.COST_TYPE_PAID];

exports.BOOKING_TYPE_NOT_REQUIRED = 'NotRequired';
exports.BOOKING_TYPE_REQUIRED = 'Required';
exports.BOOKING_TYPE_REQUIRED_FOR_NON_MEMBERS = 'RequiredForNonMembers';

exports.ALLOWED_BOOKING_TYPES = [
  exports.BOOKING_TYPE_NOT_REQUIRED,
  exports.BOOKING_TYPE_REQUIRED,
  exports.BOOKING_TYPE_REQUIRED_FOR_NON_MEMBERS,
];

exports.TIME_RANGE_TYPE_MORNING = 'morning';
exports.TIME_RANGE_TYPE_AFTERNOON = 'afternoon';
exports.TIME_RANGE_TYPE_EVENING = 'evening';

exports.SUMMARY_EVENT_SOURCE_FIELDS = [
  'entityType',
  'id',
  'status',
  'name',
  'eventType',
  'occurrenceType',
  'costType',
  'summary',
  'venueId',
  'venueName',
  'postcode',
  'latitude',
  'longitude',
  'dateFrom',
  'dateTo',
  'image',
  'imageCopyright',
  'imageRatio',
  'imageColor',
];

exports.SUMMARY_EVENT_SOURCE_FIELDS_WITH_DATES = exports.SUMMARY_EVENT_SOURCE_FIELDS.slice();

exports.SUMMARY_EVENT_SOURCE_FIELDS_WITH_DATES.push('dates');

exports.SUMMARY_EVENT_SERIES_SOURCE_FIELDS = [
  'entityType',
  'id',
  'status',
  'name',
  'eventSeriesType',
  'occurrence',
  'summary',
  'image',
  'imageCopyright',
  'imageRatio',
  'imageColor',
];

exports.SUMMARY_VENUE_SOURCE_FIELDS = [
  'entityType',
  'id',
  'status',
  'name',
  'venueType',
  'address',
  'postcode',
  'latitude',
  'longitude',
  'image',
  'imageCopyright',
  'imageRatio',
  'imageColor',
];

exports.SUMMARY_TALENT_SOURCE_FIELDS = [
  'entityType',
  'id',
  'status',
  'firstNames',
  'lastName',
  'talentType',
  'commonRole',
  'image',
  'imageCopyright',
  'imageRatio',
  'imageColor',
];

exports.FEATURED_EVENTS_SEARCH_PRESET = 'featured-events';
exports.VENUE_RELATED_EVENTS_SEARCH_PRESET = 'venue-related-events';
exports.TALENT_RELATED_EVENTS_SEARCH_PRESET = 'talent-related-events';
exports.EVENT_SERIES_RELATED_EVENTS_SEARCH_PRESET = 'event-series-related-events';
exports.ENTITY_COUNTS_SEARCH_PRESET = 'entity-counts';
exports.BY_EXTERNALEVENTID_PRESET = 'by-external-event-id';

exports.ALLOWED_SEARCH_PRESETS = [
  exports.FEATURED_EVENTS_SEARCH_PRESET,
  exports.VENUE_RELATED_EVENTS_SEARCH_PRESET,
  exports.TALENT_RELATED_EVENTS_SEARCH_PRESET,
  exports.EVENT_SERIES_RELATED_EVENTS_SEARCH_PRESET,
  exports.ENTITY_COUNTS_SEARCH_PRESET,
  exports.BY_EXTERNALEVENTID_PRESET,
];
