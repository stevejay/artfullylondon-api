const commonFields = [
  "entityType",
  "id",
  "status",
  "image",
  "imageCopyright",
  "imageRatio",
  "imageColor"
];

export const SUMMARY_EVENT = [
  ...commonFields,
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
  "dateTo"
];

export const SUMMARY_EVENT_SERIES = [
  ...commonFields,
  "name",
  "eventSeriesType",
  "occurrence",
  "summary"
];

export const SUMMARY_VENUE = [
  ...commonFields,
  "name",
  "venueType",
  "address",
  "postcode",
  "latitude",
  "longitude"
];

export const SUMMARY_TALENT = [
  ...commonFields,
  "firstNames",
  "lastName",
  "talentType",
  "commonRole"
];
