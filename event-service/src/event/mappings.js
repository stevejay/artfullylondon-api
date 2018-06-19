"use strict";

const _ = require("lodash");
const simplify = require("es-simplify");
const eventSeriesMappings = require("../event-series/mappings");
const venueMappings = require("../venue/mappings");
const talentMappings = require("../talent/mappings");
const mappings = require("../data/mappings");
const area = require("../venue/area");
const eventSearch = require("./search");
const date = require("./date");
const constants = require("./constants");
const globalConstants = require("../constants");
const id = require("../entity/id");
const globalDate = require("../date");

const hasLength = mappings.hasLength;

exports.mapRequestToDbItem = (id, request) => {
  const dateToday = globalDate.getTodayAsStringDate();

  const result = {
    id: id,
    status: request.status,
    name: request.name,
    eventType: request.eventType,
    occurrenceType: request.occurrenceType,
    costType: request.costType,
    summary: request.summary,
    rating: request.rating,
    bookingType: request.bookingType,
    venueId: request.venueId,
    useVenueOpeningTimes: request.useVenueOpeningTimes,
    schemeVersion: constants.CURRENT_EVENT_SCHEME_VERSION,
    version: request.version,
    createdDate: request.createdDate || dateToday,
    updatedDate: dateToday
  };

  if (request.dateFrom) {
    result.dateFrom = request.dateFrom;
  }
  if (request.dateTo) {
    result.dateTo = request.dateTo;
  }
  if (!_.isNil(request.costFrom)) {
    result.costFrom = request.costFrom;
  }
  if (!_.isNil(request.costTo)) {
    result.costTo = request.costTo;
  }
  if (request.bookingOpens) {
    result.bookingOpens = request.bookingOpens;
  }
  if (request.eventSeriesId) {
    result.eventSeriesId = request.eventSeriesId;
  }
  if (request.venueGuidance) {
    result.venueGuidance = request.venueGuidance;
  }
  if (request.duration) {
    result.duration = request.duration;
  }
  if (request.description) {
    result.description = request.description;
  }
  if (request.descriptionCredit) {
    result.descriptionCredit = request.descriptionCredit;
  }
  if (request.weSay) {
    result.weSay = request.weSay;
  }
  if (!_.isNil(request.minAge)) {
    result.minAge = request.minAge;
  }
  if (!_.isNil(request.maxAge)) {
    result.maxAge = request.maxAge;
  }
  if (request.soldOut) {
    result.soldOut = true;
  }
  if (request.timedEntry) {
    result.timedEntry = true;
  }

  if (request.eventType === constants.EVENT_TYPE_PERFORMANCE) {
    mappings.mapRequestTimesRangesToDbItem(request.timesRanges, result);
    mappings.mapRequestPerformancesToDbItem(request.performances, result);

    mappings.mapRequestAdditionalPerformancesToDbItem(
      request.additionalPerformances,
      result
    );

    mappings.mapRequestSpecialPerformancesToDbItem(
      request.specialPerformances,
      result
    );

    mappings.mapRequestPerformancesClosuresToDbItem(
      request.performancesClosures,
      result
    );

    mappings.mapRequestSoldOutPerformancesToDbItem(
      request.soldOutPerformances,
      result
    );
  } else if (request.eventType === constants.EVENT_TYPE_COURSE) {
    mappings.mapRequestAdditionalPerformancesToDbItem(
      request.additionalPerformances,
      result
    );
  } else {
    if (!request.useVenueOpeningTimes) {
      mappings.mapRequestTimesRangesToDbItem(request.timesRanges, result);
      mappings.mapRequestOpeningTimesToDbItem(request.openingTimes, result);
    }

    mappings.mapRequestAdditionalOpeningTimesToDbItem(
      request.additionalOpeningTimes,
      result
    );

    mappings.mapRequestSpecialOpeningTimesToDbItem(
      request.specialOpeningTimes,
      result
    );

    mappings.mapRequestOpeningTimesClosuresToDbItem(
      request.openingTimesClosures,
      result
    );
  }

  if (hasLength(request.audienceTags)) {
    result.audienceTags = mappings.mapRequestTagsToDbItem(request.audienceTags);
  }

  if (hasLength(request.mediumTags)) {
    result.mediumTags = mappings.mapRequestTagsToDbItem(request.mediumTags);
  }

  if (hasLength(request.styleTags)) {
    result.styleTags = mappings.mapRequestTagsToDbItem(request.styleTags);
  }

  if (hasLength(request.geoTags)) {
    result.geoTags = mappings.mapRequestTagsToDbItem(request.geoTags);
  }

  mappings.mapRequestTalentsToDbItem(request.talents, result);
  mappings.mapRequestReviewsToDbItem(request.reviews, result);
  mappings.mapRequestLinksToDbItem(request.links, result);
  mappings.mapRequestImagesToDbItem(request.images, result);

  return result;
};

exports.mapDbItemToAdminResponse = (dbItem, referencedEntities) => {
  return _populateReferencedEntities({ ...dbItem }, referencedEntities, false);
};

exports.mapDbItemToPublicSummaryResponse = (dbItem, referencedEntities) => {
  const result = {
    entityType: globalConstants.ENTITY_TYPE_EVENT,
    id: dbItem.id,
    status: dbItem.status,
    name: dbItem.name,
    eventType: dbItem.eventType,
    occurrenceType: dbItem.occurrenceType,
    costType: dbItem.costType,
    summary: dbItem.summary
  };

  if (dbItem.soldOut) {
    result.soldOut = dbItem.soldOut;
  }
  if (dbItem.dateFrom) {
    result.dateFrom = dbItem.dateFrom;
  }
  if (dbItem.dateTo) {
    result.dateTo = dbItem.dateTo;
  }

  mappings.mapMainImage(dbItem.images, result);

  const venue = referencedEntities.venue[0];

  result.venueName = venue.name;
  result.venueId = venue.id;
  result.postcode = venue.postcode;
  result.latitude = venue.latitude;
  result.longitude = venue.longitude;

  return result;
};

exports.mapDbItemToPublicResponse = (dbItem, referencedEntities) => {
  let result = exports.mapDbItemToPublicSummaryResponse(
    dbItem,
    referencedEntities
  );

  result.rating = dbItem.rating;
  result.bookingType = dbItem.bookingType;
  result.venueId = dbItem.venueId;
  result.useVenueOpeningTimes = dbItem.useVenueOpeningTimes;

  if (dbItem.soldOut) {
    result.soldOut = dbItem.soldOut;
  }
  if (dbItem.timedEntry) {
    result.timedEntry = dbItem.timedEntry;
  }
  if (!_.isNil(dbItem.costFrom)) {
    result.costFrom = dbItem.costFrom;
  }
  if (!_.isNil(dbItem.costTo)) {
    result.costTo = dbItem.costTo;
  }
  if (dbItem.bookingOpens) {
    result.bookingOpens = dbItem.bookingOpens;
  }
  if (dbItem.eventSeriesId) {
    result.eventSeriesId = dbItem.eventSeriesId;
  }
  if (dbItem.venueGuidance) {
    result.venueGuidance = dbItem.venueGuidance;
  }
  if (dbItem.duration) {
    result.duration = dbItem.duration;
  }
  if (dbItem.description) {
    result.description = dbItem.description;
  }
  if (dbItem.descriptionCredit) {
    result.descriptionCredit = dbItem.descriptionCredit;
  }
  if (dbItem.weSay) {
    result.weSay = dbItem.weSay;
  }
  if (!_.isNil(dbItem.minAge)) {
    result.minAge = dbItem.minAge;
  }
  if (!_.isNil(dbItem.maxAge)) {
    result.maxAge = dbItem.maxAge;
  }

  if (dbItem.timesRanges) {
    result.timesRanges = dbItem.timesRanges;
  }

  if (dbItem.performances) {
    result.performances = dbItem.performances;
  }
  if (dbItem.additionalPerformances) {
    result.additionalPerformances = dbItem.additionalPerformances;
  }
  if (dbItem.specialPerformances) {
    result.specialPerformances = dbItem.specialPerformances;
  }
  if (dbItem.performancesClosures) {
    result.performancesClosures = dbItem.performancesClosures;
  }
  if (dbItem.soldOutPerformances) {
    result.soldOutPerformances = dbItem.soldOutPerformances;
  }

  if (dbItem.openingTimes) {
    result.openingTimes = dbItem.openingTimes;
  }
  if (dbItem.additionalOpeningTimes) {
    result.additionalOpeningTimes = dbItem.additionalOpeningTimes;
  }
  if (dbItem.specialOpeningTimes) {
    result.specialOpeningTimes = dbItem.specialOpeningTimes;
  }
  if (dbItem.openingTimesClosures) {
    result.openingTimesClosures = dbItem.openingTimesClosures;
  }

  if (dbItem.audienceTags) {
    result.audienceTags = dbItem.audienceTags;
  }
  if (dbItem.mediumTags) {
    result.mediumTags = dbItem.mediumTags;
  }
  if (dbItem.styleTags) {
    result.styleTags = dbItem.styleTags;
  }
  if (dbItem.geoTags) {
    result.geoTags = dbItem.geoTags;
  }
  if (dbItem.talents) {
    result.talents = dbItem.talents;
  }
  if (dbItem.reviews) {
    result.reviews = dbItem.reviews;
  }
  if (dbItem.links) {
    result.links = dbItem.links;
  }
  if (dbItem.images) {
    result.images = dbItem.images;
  }

  result = _populateReferencedEntities(result, referencedEntities, true);
  result.venueId = dbItem.venueId; // Hack

  // We redo this mapping in case images are now coming from a referenced entity.
  mappings.mapMainImage(result.images, result);

  return result;
};

function _getTagIds(tags) {
  return (tags || []).map(tag => tag.id);
}

function _populateReferencedEntities(
  result,
  referencedEntities,
  useReplacements
) {
  const isPerformance = result.eventType === constants.EVENT_TYPE_PERFORMANCE;

  if (isPerformance) {
    delete result.openingTimes;
    delete result.additionalOpeningTimes;
    delete result.specialOpeningTimes;
    delete result.openingTimesClosures;
  } else {
    if (result.useVenueOpeningTimes) {
      delete result.openingTimes;
    }

    delete result.performances;
    delete result.additionalPerformances;
    delete result.specialPerformances;
    delete result.performancesClosures;
  }

  if (result.eventSeriesId) {
    const eventSeries = referencedEntities.eventSeries[0];

    if (useReplacements && !result.description) {
      // use the event series description if the event has none

      if (eventSeries.description) {
        result.description = eventSeries.description;

        if (eventSeries.descriptionCredit) {
          result.descriptionCredit = eventSeries.descriptionCredit;
        }
      }
    }

    if (useReplacements && !hasLength(result.images)) {
      // use the event series images if the event has none
      if (hasLength(eventSeries.images)) {
        result.images = eventSeries.images;
      }
    }

    result.eventSeries = eventSeriesMappings.mapDbItemToPublicResponse(
      eventSeries
    );
  }

  delete result.eventSeriesId;

  if (useReplacements && !hasLength(result.images)) {
    const venue = referencedEntities.venue[0];

    // use the venue images if the event and the event series have none
    if (hasLength(venue.images)) {
      result.images = venue.images;
    }
  }

  result.venue = venueMappings.mapDbItemToPublicResponse(
    referencedEntities.venue[0]
  );

  delete result.venueId;

  if (hasLength(referencedEntities.talent)) {
    const talentsMap = {};
    referencedEntities.talent.forEach(
      talent => (talentsMap[talent.id] = talent)
    );

    for (let i = 0; i < (result.talents || []).length; ++i) {
      const talent = result.talents[i];
      const roles = talent.roles;
      const characters = talent.characters;

      const talentData = talentsMap[talent.id];
      if (!talentData) {
        throw new Error("[404] Talent Not Found");
      }

      result.talents[i] = talentMappings.mapDbItemToPublicResponse(talentData);
      result.talents[i].roles = roles;

      if (characters) {
        result.talents[i].characters = characters;
      }
    }
  }

  return result;
}
