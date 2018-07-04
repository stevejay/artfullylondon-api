import _ from "lodash";
import fpPick from "lodash/fp/pick";
import mappr from "mappr";
import * as entityMapper from "../entity/mapper";
import * as idGenerator from "../entity/id-generator";
import * as eventType from "../types/event-type";
import * as entityType from "../types/entity-type";

export const CURRENT_EVENT_SCHEME_VERSION = 4;

function mapTimesRanges(params) {
  return _.isEmpty(params.timesRanges)
    ? undefined
    : params.timesRanges.map(timesRange =>
        _.pick(timesRange, ["id", "label", "dateFrom", "dateTo"])
      );
}

function mapSpecialOpeningTimes(params) {
  return _.isEmpty(params.specialOpeningTimes)
    ? undefined
    : params.specialOpeningTimes.map(special => ({
        ..._.pick(special, ["date", "from", "to"]),
        audienceTags: mapTags(special.audienceTags)
      }));
}

function mapAdditionalPerformances(params) {
  return _.isEmpty(params.additionalPerformances)
    ? undefined
    : params.additionalPerformances.map(additional =>
        _.pick(additional, ["date", "at"])
      );
}

function mapSoldOutPerformances(params) {
  return _.isEmpty(params.soldOutPerformances)
    ? undefined
    : params.soldOutPerformances.map(soldOut =>
        _.pick(soldOut, ["date", "at"])
      );
}

function mapPerformancesClosures(params) {
  return _.isEmpty(params.performancesClosures)
    ? undefined
    : params.performancesClosures.map(closure =>
        _.pick(closure, ["date", "at"])
      );
}

function mapSpecialPerformances(params) {
  return _.isEmpty(params.specialPerformances)
    ? undefined
    : params.specialPerformances.map(special => ({
        ..._.pick(special, ["date", "at"]),
        audienceTags: mapTags(special.audienceTags)
      }));
}

function mapPerformances(params) {
  return _.isEmpty(params.performances)
    ? undefined
    : params.performances.map(performance =>
        _.pick(performance, ["day", "at", "timesRangeId"])
      );
}

function mapTags(tags) {
  return _.isEmpty(tags)
    ? undefined
    : tags.map(tag => _.pick(tag, ["id", "label"]));
}

const mapTalents = mappr({
  talents: params =>
    _.isEmpty(params.talents)
      ? undefined
      : params.talents.map(talent => ({
          id: talent.id,
          roles: _.isEmpty(talent.roles) ? undefined : talent.roles,
          characters: _.isEmpty(talent.characters)
            ? undefined
            : talent.characters
        }))
});

const mapReviews = mappr({
  reviews: params =>
    _.isEmpty(params.reviews)
      ? undefined
      : params.reviews.map(review => _.pick(review, ["source", "rating"]))
});

export const mapCreateOrUpdateEventRequest = mappr.compose(
  params => ({
    id: params.id || idGenerator.generateFromEvent(params),
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
    "notes",
    "minAge",
    "maxAge",
    "soldOut",
    "timedEntry"
  ]),
  params => {
    switch (params.eventType) {
      case eventType.PERFORMANCE:
        return {
          timesRanges: mapTimesRanges(params),
          performances: mapPerformances(params),
          additionalPerformances: mapAdditionalPerformances(params),
          specialPerformances: mapSpecialPerformances(params),
          performancesClosures: mapPerformancesClosures(params),
          soldOutPerformances: mapSoldOutPerformances(params)
        };
      case eventType.COURSE:
        return {
          additionalPerformances: mapAdditionalPerformances(params)
        };
      default:
        return {
          timesRanges: params.useVenueOpeningTimes
            ? undefined
            : mapTimesRanges(params),
          openingTimes: params.useVenueOpeningTimes
            ? undefined
            : entityMapper.mapRequestOpeningTimes(params),
          additionalOpeningTimes: entityMapper.mapRequestAdditionalOpeningTimes(
            params
          ),
          specialOpeningTimes: mapSpecialOpeningTimes(params),
          openingTimesClosures: entityMapper.mapRequestOpeningTimesClosures(
            params
          )
        };
    }
  },
  {
    audienceTags: params => mapTags(params.audienceTags),
    mediumTags: params => mapTags(params.mediumTags),
    styleTags: params => mapTags(params.styleTags),
    geoTags: params => mapTags(params.geoTags)
  },
  mapTalents,
  mapReviews,
  entityMapper.mapRequestEditDates,
  entityMapper.mapRequestLinks,
  entityMapper.mapRequestImages
);

export const mapResponse = mappr(
  mappr.compose(
    () => ({ entityType: entityType.EVENT }),
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
      "dateTo",
      "rating",
      "bookingType",
      "useVenueOpeningTimes",
      "timedEntry",
      "costFrom",
      "costTo",
      "bookingOpens",
      "venueGuidance",
      "duration",
      "description",
      "descriptionCredit",
      "weSay",
      "notes",
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
      "images",
      "version"
    ])
    // {
    //   venueName: "venue.name",
    //   venueId: "venue.id",
    //   postcode: "venue.postcode",
    //   latitude: "venue.latitude",
    //   longitude: "venue.longitude"
    // }
  ),
  fixUpEventValuesFromReferencedEntities,
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
      : event.talents.map(talent => ({
          ...talentsIdMap[talent.id],
          ...talent
        }))
  };
  delete result.eventSeriesId;
  delete result.venueId;
  return result;
}

export function fixUpEventValuesFromReferencedEntities(event) {
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
