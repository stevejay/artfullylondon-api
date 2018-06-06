export const DATE_FORMAT = "YYYY/MM/DD";

export const SEARCH_RESULTS_DEFAULT_PAGE_SIZE = 12;
export const AUTOCOMPLETE_MAX_RESULTS = 5;
export const AUTOCOMPLETE_COMBINED_MAX_RESULTS = 6;
export const FULLSEARCH_COMBINED_MAX_RESULTS = 15;

export const SUMMARY_EVENT_SOURCE_FIELDS = [
  "entityType",
  "id",
  "status",
  "name",
  "eventType",
  "occurrenceType",
  "costType",
  "summary",
  "venueId",
  "venueName",
  "postcode",
  "latitude",
  "longitude",
  "dateFrom",
  "dateTo",
  "image",
  "imageCopyright",
  "imageRatio",
  "imageColor"
];

const fields = SUMMARY_EVENT_SOURCE_FIELDS.slice();
fields.push("dates");
export const SUMMARY_EVENT_SOURCE_FIELDS_WITH_DATES = fields;

export const SUMMARY_EVENT_SERIES_SOURCE_FIELDS = [
  "entityType",
  "id",
  "status",
  "name",
  "eventSeriesType",
  "occurrence",
  "summary",
  "image",
  "imageCopyright",
  "imageRatio",
  "imageColor"
];

export const SUMMARY_VENUE_SOURCE_FIELDS = [
  "entityType",
  "id",
  "status",
  "name",
  "venueType",
  "address",
  "postcode",
  "latitude",
  "longitude",
  "image",
  "imageCopyright",
  "imageRatio",
  "imageColor"
];

export const SUMMARY_TALENT_SOURCE_FIELDS = [
  "entityType",
  "id",
  "status",
  "firstNames",
  "lastName",
  "talentType",
  "commonRole",
  "image",
  "imageCopyright",
  "imageRatio",
  "imageColor"
];
