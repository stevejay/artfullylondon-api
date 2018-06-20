import _ from "lodash";
import fpPick from "lodash/fp/pick";
import mappr from "mappr";
import * as entityMapper from "../entity/mapper";
import * as identity from "../entity/id";
import * as eventType from "../types/event-type";

export const CURRENT_EVENT_SCHEME_VERSION = 4;

export const mapCreateOrUpdateEventRequest = mappr.compose(
  params => ({
    id:
      params.id ||
      identity.createEventId(params.venueId, params.dateFrom, params.name),
    schemeVersion: CURRENT_EVENT_SCHEME_VERSION
  }),
  fpPick([
    "status",
    "name",
    "eventType",
    "occurrenceType",
    "costType",
    "summary",
    "rating",
    "bookingType",
    "venueId",
    "useVenueOpeningTimes",
    "version",
    "description",
    "descriptionCredit",
    "dateFrom",
    "dateTo",
    "costFrom",
    "costTo",
    "bookingOpens",
    "eventSeriesId",
    "venueGuidance",
    "duration",
    "weSay",
    "minAge",
    "maxAge",
    "soldOut",
    "timedEntry"
  ]),
  params => {
    switch (params.eventType) {
      case eventType.PERFORMANCE:
        return {
          timesRanges: entityMapper.mapTimesRanges,
          performances: entityMapper.mapRequestPerformancesToDbItem,
          additionalPerformances: entityMapper.mapAdditionalPerformances,
          specialPerformances: entityMapper.mapSpecialPerformances,
          performancesClosures: entityMapper.mapPerformancesClosures,
          soldOutPerformances: entityMapper.mapSoldOutPerformances
        };
      case eventType.COURSE:
        return {
          additionalPerformances: entityMapper.mapAdditionalPerformances
        };
      default:
        return {
          timesRanges: params.useVenueOpeningTimes
            ? undefined
            : entityMapper.mapTimesRanges,
          openingTimes: params.useVenueOpeningTimes
            ? undefined
            : entityMapper.mapOpeningTimes,
          additionalOpeningTimes: entityMapper.mapAdditionalOpeningTimes,
          specialOpeningTimes: entityMapper.mapSpecialOpeningTimes,
          openingTimesClosures: entityMapper.mapOpeningTimesClosures
        };
    }
  },
  {
    audienceTags: params => entityMapper.mapTags(params.audienceTags),
    mediumTags: params => entityMapper.mapTags(params.mediumTags),
    styleTags: params => entityMapper.mapTags(params.styleTags),
    geoTags: params => entityMapper.mapTags(params.geoTags)
  },
  entityMapper.mapTalents,
  entityMapper.mapReviews,
  entityMapper.mapEntityEditDates,
  entityMapper.mapRequestLinks,
  entityMapper.mapRequestImages
);

export const mapToPublicSummaryResponse = mappr.compose(
  fpPick([
    "entityType",
    "id",
    "status",
    "name",
    "eventType",
    "occurrenceType",
    "costType",
    "summary",
    "soldOut",
    "dateFrom",
    "dateTo"
  ]),
  {
    venueName: "venue.name",
    venueId: "venue.id",
    postcode: "venue.postcode",
    latitude: "venue.latitude",
    longitude: "venue.longitude"
  },
  entityMapper.mapResponseMainImage
);

export const mapToPublicFullResponse = mappr.transform(
  mappr.compose(
    mapToPublicSummaryResponse,
    fpPick([
      "rating",
      "bookingType",
      "useVenueOpeningTimes",
      "timedEntry",
      "costFrom",
      "costTo",
      "bookingOpens",
      "eventSeriesId",
      "venueGuidance",
      "duration",
      "description",
      "descriptionCredit",
      "weSay",
      "minAge",
      "maxAge",
      "timesRanges",
      "performances",
      "additionalPerformances",
      "specialPerformances",
      "performancesClosures",
      "soldOutPerformances",
      "openingTimes",
      "additionalOpeningTimes",
      "specialOpeningTimes",
      "openingTimesClosures",
      "audienceTags",
      "mediumTags",
      "styleTags",
      "geoTags",
      "talents",
      "reviews",
      "links",
      "images"
    ]),
    { isFullEntity: true },
    // We redo this mapping in case images are now coming from a referenced entity.
    entityMapper.mapResponseMainImage
  ),
  copyValuesFromReferencedEntities
);

export function mergeReferencedEntities(event, referencedEntities) {
  const talentsIdMap = _.keyBy(referencedEntities.talents, "id");

  const result = {
    ...event,
    venue: referencedEntities.venue,
    eventSeries: referencedEntities.eventSeries || undefined,
    talents: event.talents.map(talent => ({
      ...talentsIdMap[talent.id],
      ...talent
    }))
  };

  delete result.eventSeriesId;
  return result;
}

export function copyValuesFromReferencedEntities(event) {
  const result = { ...event };

  if (event.eventSeries) {
    if (!event.description) {
      // use the event series description if the event has none

      if (event.eventSeries.description) {
        result.description = event.eventSeries.description;

        if (event.eventSeries.descriptionCredit) {
          result.descriptionCredit = event.eventSeries.descriptionCredit;
        }
      }
    }

    if (_.isEmpty(event.images)) {
      // use the event series images if the event has none
      if (!_.isEmpty(event.eventSeries.images)) {
        result.images = event.eventSeries.images;
      }
    }
  }

  if (_.isEmpty(event.images)) {
    // use the venue images if the event and the event series have none
    if (!_.isEmpty(event.venue.images)) {
      result.images = event.venue.images;
    }
  }

  return result;
}
