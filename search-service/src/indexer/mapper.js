import _ from "lodash";
import latinize from "latinize";
import simplify from "es-simplify";
import * as talentType from "../talent-type";
import * as entityType from "../entity-type";
import * as eventType from "../event-type";
import * as artsType from "../arts-type";
import * as bookingType from "../booking-type";
import * as constants from "./constants";
import * as time from "../time";
import * as area from "./area";
import * as search from "./search";

export function mapTalentForTalentIndex(talent) {
  const result = {
    entityType: entityType.TALENT,
    id: talent.id,
    status: talent.status,
    lastName: talent.lastName,
    talentType: talent.talentType,
    commonRole: talent.commonRole
  };

  if (talent.firstNames) {
    result.firstNames = talent.firstNames;
  }

  mapMainImage(talent.images, result);
  result.lastName_sort = mapNameToSortName(talent.lastName);
  result.version = talent.version;
  return result;
}

export function mapTalentForAutocompleteIndex(talent) {
  const fullName = talent.firstNames
    ? talent.firstNames + " " + talent.lastName
    : talent.lastName;

  const simplifiedFullName = simplify(fullName);

  const lastName = talent.lastName;
  const simplifiedLastName = simplify(lastName);

  const noCommonStartWordsSimplifiedLastName =
    talent.talentType === talentType.INDIVIDUAL
      ? null
      : removeCommonStartWords(simplifiedLastName);

  const result = {
    nameSuggest: [simplifiedFullName],
    output: fullName,
    entityType: entityType.TALENT,
    id: talent.id,
    status: talent.status,
    talentType: talent.talentType,
    commonRole: talent.commonRole,
    version: talent.version
  };

  if (simplifiedLastName && simplifiedLastName !== simplifiedFullName) {
    result.nameSuggest.push(simplifiedLastName);
  }

  if (
    noCommonStartWordsSimplifiedLastName &&
    noCommonStartWordsSimplifiedLastName !== simplifiedLastName
  ) {
    result.nameSuggest.push(noCommonStartWordsSimplifiedLastName);
  }

  return result;
}

function mapMainImage(images, result) {
  const mainImage = images && images.length ? images[0] : null;

  if (mainImage) {
    result.image = mainImage.id;

    if (mainImage.copyright) {
      result.imageCopyright = mainImage.copyright;
    }

    if (mainImage.ratio) {
      result.imageRatio = mainImage.ratio;
    }

    if (mainImage.dominantColor) {
      result.imageColor = mainImage.dominantColor;
    }
  }

  return result;
}

const COMMON_START_WORDS_WORDS_REGEX = /^(?:the|a)\s+/i;
const GENERIC_START_WORD_REGEX = /^(theatre|gallery)\s+/i;

function mapNameToSortName(name) {
  if (!name) {
    return name;
  }

  let result = latinize(name || "").toLowerCase();
  return result.replace(COMMON_START_WORDS_WORDS_REGEX, " ").trim();
}

function removeCommonStartWords(name) {
  return name
    .replace(COMMON_START_WORDS_WORDS_REGEX, "")
    .replace(GENERIC_START_WORD_REGEX, "");
}

export function mapEventSeriesForEventSeriesIndex(eventSeries) {
  const result = {
    entityType: entityType.EVENT_SERIES,
    id: eventSeries.id,
    status: eventSeries.status,
    name: eventSeries.name,
    eventSeriesType: eventSeries.eventSeriesType,
    occurrence: eventSeries.occurrence,
    summary: eventSeries.summary
  };

  mapMainImage(eventSeries.images, result);
  result.name_sort = mapNameToSortName(eventSeries.name);
  result.version = eventSeries.version;
  return result;
}

export function mapEventSeriesForAutocompleteIndex(eventSeries) {
  const name = eventSeries.name;
  const simplifiedName = simplify(name);
  const noCommonStartWordsSimplifiedName = removeCommonStartWords(
    simplifiedName
  );

  const result = {
    nameSuggest: [simplifiedName],
    output: `${name} (Event Series)`,
    entityType: "event-series",
    id: eventSeries.id,
    status: eventSeries.status,
    version: eventSeries.version
  };

  if (noCommonStartWordsSimplifiedName !== simplifiedName) {
    result.nameSuggest.push(noCommonStartWordsSimplifiedName);
  }

  return result;
}

export function mapVenueForVenueIndex(venue) {
  const result = {
    entityType: entityType.VENUE,
    id: venue.id,
    status: venue.status,
    name: venue.name,
    venueType: venue.venueType,
    address: venue.address,
    postcode: venue.postcode,
    latitude: venue.latitude,
    longitude: venue.longitude
  };

  mapMainImage(venue.images, result);
  result.name_sort = mapNameToSortName(result.name);
  result.version = venue.version;

  result.locationOptimized = {
    lat: result.latitude,
    lon: result.longitude
  };

  return result;
}

export function mapVenueForAutocompleteIndex(venue) {
  const name = venue.name;
  const simplifiedName = simplify(name);

  const noCommonStartWordsSimplifiedName = removeCommonStartWords(
    simplifiedName
  );

  const result = {
    nameSuggest: [simplifiedName],
    output: name,
    entityType: entityType.VENUE,
    id: venue.id,
    status: venue.status,
    venueType: venue.venueType,
    address: venue.address,
    postcode: venue.postcode,
    version: venue.version
  };

  if (noCommonStartWordsSimplifiedName !== simplifiedName) {
    result.nameSuggest.push(noCommonStartWordsSimplifiedName);
  }

  return result;
}

export function mapEventForEventIndex(dbItem, referencedEntities) {
  let fullResult = exports.mapDbItemToPublicSummaryResponse(
    dbItem,
    referencedEntities
  );

  fullResult.rating = dbItem.rating;
  fullResult.bookingType = dbItem.bookingType;
  fullResult.venueId = dbItem.venueId;
  fullResult.useVenueOpeningTimes = dbItem.useVenueOpeningTimes;

  if (dbItem.soldOut) {
    fullResult.soldOut = dbItem.soldOut;
  }
  if (dbItem.timedEntry) {
    fullResult.timedEntry = dbItem.timedEntry;
  }
  if (!_.isNil(dbItem.costFrom)) {
    fullResult.costFrom = dbItem.costFrom;
  }
  if (!_.isNil(dbItem.costTo)) {
    fullResult.costTo = dbItem.costTo;
  }
  if (dbItem.bookingOpens) {
    fullResult.bookingOpens = dbItem.bookingOpens;
  }
  if (dbItem.eventSeriesId) {
    fullResult.eventSeriesId = dbItem.eventSeriesId;
  }
  if (dbItem.venueGuidance) {
    fullResult.venueGuidance = dbItem.venueGuidance;
  }
  if (dbItem.duration) {
    fullResult.duration = dbItem.duration;
  }
  if (dbItem.description) {
    fullResult.description = dbItem.description;
  }
  if (dbItem.descriptionCredit) {
    fullResult.descriptionCredit = dbItem.descriptionCredit;
  }
  if (dbItem.weSay) {
    fullResult.weSay = dbItem.weSay;
  }
  if (!_.isNil(dbItem.minAge)) {
    fullResult.minAge = dbItem.minAge;
  }
  if (!_.isNil(dbItem.maxAge)) {
    fullResult.maxAge = dbItem.maxAge;
  }

  if (dbItem.timesRanges) {
    fullResult.timesRanges = dbItem.timesRanges;
  }

  if (dbItem.performances) {
    fullResult.performances = dbItem.performances;
  }
  if (dbItem.additionalPerformances) {
    fullResult.additionalPerformances = dbItem.additionalPerformances;
  }
  if (dbItem.specialPerformances) {
    fullResult.specialPerformances = dbItem.specialPerformances;
  }
  if (dbItem.performancesClosures) {
    fullResult.performancesClosures = dbItem.performancesClosures;
  }
  if (dbItem.soldOutPerformances) {
    fullResult.soldOutPerformances = dbItem.soldOutPerformances;
  }

  if (dbItem.openingTimes) {
    fullResult.openingTimes = dbItem.openingTimes;
  }
  if (dbItem.additionalOpeningTimes) {
    fullResult.additionalOpeningTimes = dbItem.additionalOpeningTimes;
  }
  if (dbItem.specialOpeningTimes) {
    fullResult.specialOpeningTimes = dbItem.specialOpeningTimes;
  }
  if (dbItem.openingTimesClosures) {
    fullResult.openingTimesClosures = dbItem.openingTimesClosures;
  }

  if (dbItem.audienceTags) {
    fullResult.audienceTags = dbItem.audienceTags;
  }
  if (dbItem.mediumTags) {
    fullResult.mediumTags = dbItem.mediumTags;
  }
  if (dbItem.styleTags) {
    fullResult.styleTags = dbItem.styleTags;
  }
  if (dbItem.geoTags) {
    fullResult.geoTags = dbItem.geoTags;
  }
  if (dbItem.talents) {
    fullResult.talents = dbItem.talents;
  }
  if (dbItem.reviews) {
    fullResult.reviews = dbItem.reviews;
  }
  if (dbItem.links) {
    fullResult.links = dbItem.links;
  }
  if (dbItem.images) {
    fullResult.images = dbItem.images;
  }

  fullResult = populateReferencedEntities(fullResult, referencedEntities, true);

  fullResult.venueId = dbItem.venueId; // Hack

  // We redo this mapping in case images are now coming from a referenced entity.
  mapMainImage(fullResult.images, fullResult);

  const dateTodayStr = time.createStringDateFromToday(0);
  const dateMaxStr = time.createStringDateFromToday(370);

  const postcodeDistrict = getPostcodeDistrict(fullResult.venue.postcode);

  const result = {
    entityType: entityType.EVENT,
    id: fullResult.id,
    status: fullResult.status,
    name: fullResult.name,
    name_sort: mapNameToSortName(fullResult.name),
    venueId: fullResult.venue.id,
    venueName: fullResult.venue.name,
    venueName_sort: mapNameToSortName(fullResult.venue.name),
    area: area.getLondonArea(postcodeDistrict),
    postcode: fullResult.venue.postcode,
    eventType: fullResult.eventType,
    occurrenceType: fullResult.occurrenceType,
    costType: fullResult.costType,
    bookingType:
      fullResult.bookingType === bookingType.REQUIRED_FOR_NON_MEMBERS
        ? bookingType.REQUIRED
        : fullResult.bookingType,
    summary: fullResult.summary,
    rating: fullResult.rating,
    latitude: fullResult.latitude,
    longitude: fullResult.longitude,
    locationOptimized: {
      lat: fullResult.venue.latitude,
      lon: fullResult.venue.longitude
    },
    artsType: mapMediumTagsToArtsType(
      fullResult.mediumTags,
      fullResult.eventType
    )
  };

  if (dbItem.links && dbItem.links.length > 0) {
    const homepageIndex = dbItem.links.findIndex(
      link => link.type === "Homepage" // TODO replace
    );

    if (homepageIndex > -1) {
      const link = dbItem.links[homepageIndex];

      if (link.url) {
        result.externalEventId = createExternalEventId(
          result.venueId,
          link.url
        );
      }
    }
  }

  if (fullResult.dateFrom) {
    result.dateFrom = fullResult.dateFrom;
  }
  if (fullResult.dateTo) {
    result.dateTo = fullResult.dateTo;
  }
  if (!_.isNil(fullResult.costFrom)) {
    result.costFrom = fullResult.costFrom;
  }
  if (!_.isNil(fullResult.minAge)) {
    result.minAge = fullResult.minAge;
  }
  if (!_.isNil(fullResult.maxAge)) {
    result.maxAge = fullResult.maxAge;
  }

  if (fullResult.eventSeries) {
    result.eventSeriesId = fullResult.eventSeries.id;
  }

  if (fullResult.talents && fullResult.talents.length) {
    result.talents = fullResult.talents.map(talent => talent.id);
  }

  const mediumWithStyleTags = generateMediumWithStyleTags(
    fullResult.mediumTags,
    fullResult.styleTags
  );

  const concatenatedTags = getTagIds(fullResult.geoTags)
    .concat(getTagIds(fullResult.audienceTags))
    .concat(getTagIds(fullResult.mediumTags))
    .concat(getTagIds(mediumWithStyleTags));

  if (concatenatedTags.length) {
    result.tags = concatenatedTags;
  }

  const dates = search.createSearchDateObjects(
    fullResult,
    dateTodayStr,
    dateMaxStr,
    constants.NAMED_CLOSURE_DATES_LOOKUP
  );

  if (dates.length) {
    result.dates = dates;
  }

  mapMainImage(fullResult.images, result);
  result.version = dbItem.version;

  return result;
}

function populateReferencedEntities(
  result,
  referencedEntities,
  useReplacements
) {
  const isPerformance = result.eventType === eventType.PERFORMANCE;

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

    if (useReplacements && _.isEmpty(result.images)) {
      // use the event series images if the event has none
      if (!_.isEmpty(eventSeries.images)) {
        result.images = eventSeries.images;
      }
    }

    result.eventSeries = mapEventSeries(eventSeries);
  }

  delete result.eventSeriesId;

  if (useReplacements && _.isEmpty(result.images)) {
    const venue = referencedEntities.venue[0];

    // use the venue images if the event and the event series have none
    if (!_.isEmpty(venue.images)) {
      result.images = venue.images;
    }
  }

  result.venue = mapVenue(referencedEntities.venue[0]);
  delete result.venueId;

  if (!_.isEmpty(referencedEntities.talent)) {
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

      result.talents[i] = mapTalent(talentData);
      result.talents[i].roles = roles;

      if (characters) {
        result.talents[i].characters = characters;
      }
    }
  }

  return result;
}

const POSTCODE_DISTRICT_REGEX = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?/;

function getPostcodeDistrict(postcode) {
  var matches = (postcode || "").match(POSTCODE_DISTRICT_REGEX);
  return matches ? matches[0] : undefined;
}

export function mapMediumTagsToArtsType(mediumTags, eventType) {
  if (mediumTags && mediumTags.length) {
    const mediumTagIds = mediumTags.map(tag => tag.id);

    if (_.intersection(mediumTagIds, constants.VISUAL_ARTS_MEDIUMS).length) {
      return artsType.VISUAL;
    }

    if (
      _.intersection(mediumTagIds, constants.PERFORMING_ARTS_MEDIUMS).length
    ) {
      return artsType.PERFORMING;
    }

    if (
      _.intersection(mediumTagIds, constants.CREATIVE_WRITING_MEDIUMS).length
    ) {
      return artsType.CREATIVE_WRITING;
    }
  }

  // use event type as a last resort
  if (eventType === eventType.EXHIBITION) {
    return artsType.VISUAL;
  } else {
    return artsType.PERFORMING;
  }
}

function createExternalEventId(venueId, eventUrl) {
  const normalisedEventUrl =
    eventUrl.replace(/^https?:\/\/[^/]+/i, "").toLowerCase() || "/";

  return venueId + "|" + normalisedEventUrl;
}

function getTagIds(tags) {
  return (tags || []).map(tag => tag.id);
}

function generateMediumWithStyleTags(mediumTags, styleTags) {
  const result = [];

  if (!styleTags || !styleTags.length) {
    return result;
  }

  mediumTags.forEach(mediumTag => {
    styleTags.forEach(styleTag => {
      const newTag = createMediumWithStyleTag(mediumTag, styleTag);
      result.push(newTag);
    });
  });

  return result;
}

function createMediumWithStyleTag(mediumTag, styleTag) {
  const styleId = styleTag.id.slice(5); // remove initial 'style' text
  const newId = mediumTag.id + styleId;
  const newLabel = styleTag.label + " " + mediumTag.label;
  return { id: newId, label: newLabel };
}

function mapEventSeries(dbItem) {
  const result = {
    entityType: entityType.EVENT_SERIES,
    id: dbItem.id,
    status: dbItem.status,
    name: dbItem.name,
    eventSeriesType: dbItem.eventSeriesType,
    occurrence: dbItem.occurrence,
    summary: dbItem.summary
  };

  mapMainImage(dbItem.images, result);
  result.description = dbItem.description;

  if (dbItem.descriptionCredit) {
    result.descriptionCredit = dbItem.descriptionCredit;
  }
  if (dbItem.weSay) {
    result.weSay = dbItem.weSay;
  }
  if (dbItem.links) {
    result.links = dbItem.links;
  }
  if (dbItem.images) {
    result.images = dbItem.images;
  }

  return result;
}

function mapVenue(dbItem) {
  const result = {
    entityType: entityType.VENUE,
    id: dbItem.id,
    status: dbItem.status,
    name: dbItem.name,
    venueType: dbItem.venueType,
    address: dbItem.address,
    postcode: dbItem.postcode,
    latitude: dbItem.latitude,
    longitude: dbItem.longitude
  };

  mapMainImage(dbItem.images, result);

  result.wheelchairAccessType = dbItem.wheelchairAccessType;
  result.disabledBathroomType = dbItem.disabledBathroomType;
  result.hearingFacilitiesType = dbItem.hearingFacilitiesType;
  result.hasPermanentCollection = !!dbItem.hasPermanentCollection;

  if (dbItem.description) {
    result.description = dbItem.description;
  }
  if (dbItem.descriptionCredit) {
    result.descriptionCredit = dbItem.descriptionCredit;
  }
  if (dbItem.email) {
    result.email = dbItem.email;
  }
  if (dbItem.telephone) {
    result.telephone = dbItem.telephone;
  }
  if (dbItem.weSay) {
    result.weSay = dbItem.weSay;
  }
  if (dbItem.notes) {
    result.notes = dbItem.notes;
  }

  if (dbItem.openingTimes) {
    result.openingTimes = dbItem.openingTimes;
  }
  if (dbItem.additionalOpeningTimes) {
    result.additionalOpeningTimes = dbItem.additionalOpeningTimes;
  }
  if (dbItem.openingTimesClosures) {
    result.openingTimesClosures = dbItem.openingTimesClosures;
  }
  if (dbItem.namedClosures) {
    result.namedClosures = dbItem.namedClosures;
  }
  if (dbItem.links) {
    result.links = dbItem.links;
  }
  if (dbItem.images) {
    result.images = dbItem.images;
  }

  return result;
}

function mapTalent(dbItem) {
  const result = {
    entityType: entityType.TALENT,
    id: dbItem.id,
    status: dbItem.status,
    lastName: dbItem.lastName,
    talentType: dbItem.talentType,
    commonRole: dbItem.commonRole
  };

  if (dbItem.firstNames) {
    result.firstNames = dbItem.firstNames;
  }

  mapMainImage(dbItem.images, result);

  if (dbItem.description) {
    result.description = dbItem.description;
  }
  if (dbItem.descriptionCredit) {
    result.descriptionCredit = dbItem.descriptionCredit;
  }
  if (dbItem.weSay) {
    result.weSay = dbItem.weSay;
  }
  if (dbItem.links) {
    result.links = dbItem.links;
  }
  if (dbItem.images) {
    result.images = dbItem.images;
  }

  return result;
}
