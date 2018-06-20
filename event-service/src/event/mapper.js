import _ from "lodash";
import fpPick from "lodash/fp/pick";
import mappr from "mappr";
import * as entityMapper from "../entity/mapper";
import * as identity from "../entity/id";
import * as eventType from "../types/event-type";
import * as entityType from "../types/entity-type";

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
          timesRanges: entityMapper.mapTimesRanges(params),
          performances: entityMapper.mapRequestPerformancesToDbItem(params),
          additionalPerformances: entityMapper.mapAdditionalPerformances(
            params
          ),
          specialPerformances: entityMapper.mapSpecialPerformances(params),
          performancesClosures: entityMapper.mapPerformancesClosures(params),
          soldOutPerformances: entityMapper.mapSoldOutPerformances(params)
        };
      case eventType.COURSE:
        return {
          additionalPerformances: entityMapper.mapAdditionalPerformances(params)
        };
      default:
        return {
          timesRanges: params.useVenueOpeningTimes
            ? undefined
            : entityMapper.mapTimesRanges(params),
          openingTimes: params.useVenueOpeningTimes
            ? undefined
            : entityMapper.mapOpeningTimes(params),
          additionalOpeningTimes: entityMapper.mapAdditionalOpeningTimes(
            params
          ),
          specialOpeningTimes: entityMapper.mapSpecialOpeningTimes(params),
          openingTimesClosures: entityMapper.mapOpeningTimesClosures(params)
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
  { entityType: () => entityType.EVENT },
  fpPick([
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

export const mapToPublicFullResponse = mappr(
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
      "venue",
      "eventSeries",
      "reviews",
      "links",
      "images"
    ]),
    { isFullEntity: true }
  ),
  copyValuesFromReferencedEntities,
  // We redo this mapping in case images are now coming from a referenced entity:
  event => {
    return {
      ...event,
      ...entityMapper.mapResponseMainImage(event)
    };
  }
);

export function mergeReferencedEntities(event, referencedEntities) {
  const talentsIdMap = _.keyBy(referencedEntities.talents, "id");

  const result = {
    ...event,
    venue: referencedEntities.venue,
    eventSeries: referencedEntities.eventSeries || undefined,
    talents: _.isEmpty(event.talents)
      ? undefined
      : event.talents.map(talent => {
          const talentEntity = talentsIdMap[talent.id];
          if (_.isNil(talentEntity)) {
            throw new Error("[404] Referenced talent not found");
          }

          return {
            ...talentEntity,
            ...talent
          };
        })
  };

  delete result.eventSeriesId;
  return result;
}

export function copyValuesFromReferencedEntities(event) {
  const result = { ...event };

  if (result.eventSeries) {
    if (!result.description) {
      // use the event series description if the event has none

      if (result.eventSeries.description) {
        result.description = event.eventSeries.description;

        if (result.eventSeries.descriptionCredit) {
          result.descriptionCredit = result.eventSeries.descriptionCredit;
        }
      }
    }

    if (_.isEmpty(result.images)) {
      // use the event series images if the event has none
      if (!_.isEmpty(result.eventSeries.images)) {
        result.images = result.eventSeries.images;
      }
    }
  }

  if (_.isEmpty(result.images)) {
    // use the venue images if the event and the event series have none
    if (!_.isEmpty(result.venue.images)) {
      result.images = result.venue.images;
    }
  }

  return result;
}
