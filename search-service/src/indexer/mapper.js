import _ from "lodash";
import fpPick from "lodash/fp/pick";
import mappr from "mappr";
import latinize from "latinize";
import simplify from "es-simplify";
import moment from "moment";
import * as artsType from "../types/arts-type";
import * as bookingType from "../types/booking-type";
import * as linkType from "../types/link-type";
import * as mediumType from "../types/medium-type";
import * as geoUtils from "./geo-utils";
import * as eventDatesGenerator from "./event-dates-generator";
import * as namedClosuresLookup from "./named-closures-lookup";

const mapLocation = mappr({
  lat: "latitude",
  lon: "longitude"
});

const mapMainImage = mappr({
  image: "images[0].id",
  imageCopyright: "images[0].copyright",
  imageRatio: "images[0].ratio",
  imageColor: "images[0].dominantColor"
});

function mapTalentName(talent) {
  return talent.firstNames
    ? `${talent.firstNames} ${talent.lastName}`
    : talent.lastName;
}

const COMMON_START_WORDS_WORDS_REGEX = /^(?:the|a)\s+/i;
const GENERIC_START_WORD_REGEX = /^(theatre|gallery)\s+/i;

function removeCommonStartWords(name) {
  return name
    .replace(COMMON_START_WORDS_WORDS_REGEX, "")
    .replace(GENERIC_START_WORD_REGEX, "");
}

function mapNameToSortName(entity) {
  const name = entity.name || entity.lastName;
  const result = latinize(name || "").toLowerCase();
  return result.replace(COMMON_START_WORDS_WORDS_REGEX, " ").trim();
}

export const mapTalentForTalentIndex = mappr.compose(
  fpPick([
    "entityType",
    "id",
    "status",
    "firstNames",
    "lastName",
    "talentType",
    "commonRole",
    "version"
  ]),
  mapMainImage,
  { lastName_sort: mapNameToSortName }
);

export const mapTalentForAutocompleteIndex = mappr.compose(
  fpPick(["entityType", "id", "status", "talentType", "commonRole", "version"]),
  talent => {
    const output = mapTalentName(talent);
    const simplifiedLastName = simplify(talent.lastName);
    return {
      output,
      nameSuggest: _.uniq([
        simplify(output),
        simplifiedLastName,
        removeCommonStartWords(simplifiedLastName)
      ])
    };
  }
);

export const mapEventSeriesForEventSeriesIndex = mappr.compose(
  fpPick([
    "entityType",
    "id",
    "status",
    "name",
    "eventSeriesType",
    "occurrence",
    "summary",
    "version"
  ]),
  mapMainImage,
  { name_sort: mapNameToSortName }
);

export const mapEventSeriesForAutocompleteIndex = mappr.compose(
  fpPick(["entityType", "id", "status", "version"]),
  eventSeries => {
    const simplifiedName = simplify(eventSeries.name);
    return {
      output: `${eventSeries.name} (Event Series)`,
      nameSuggest: _.uniq([
        simplifiedName,
        removeCommonStartWords(simplifiedName)
      ])
    };
  }
);

export const mapVenueForVenueIndex = mappr.compose(
  fpPick([
    "entityType",
    "id",
    "status",
    "name",
    "venueType",
    "address",
    "postcode",
    "latitude",
    "longitude",
    "version"
  ]),
  mapMainImage,
  {
    name_sort: mapNameToSortName,
    locationOptimized: mapLocation
  }
);

export const mapVenueForAutocompleteIndex = mappr.compose(
  fpPick([
    "entityType",
    "id",
    "status",
    "version",
    "venueType",
    "address",
    "postcode"
  ]),
  venue => {
    const simplifiedName = simplify(venue.name);
    return {
      output: venue.name,
      nameSuggest: _.uniq([
        simplifiedName,
        removeCommonStartWords(simplifiedName)
      ])
    };
  }
);

export const mapEventForEventIndex = mappr.compose(
  fpPick([
    "entityType",
    "id",
    "status",
    "name",
    "eventType",
    "occurrenceType",
    "costType",
    "summary",
    "rating",
    "latitude",
    "longitude",
    "version",
    "dateFrom",
    "dateTo",
    "minAge",
    "maxAge",
    "costFrom"
  ]),
  {
    venueName: "venue.name",
    venueId: "venue.id",
    postcode: "venue.postcode",
    latitude: "venue.latitude",
    longitude: "venue.longitude",
    eventSeriesId: "eventSeries.id"
  },
  mapMainImage,
  {
    name_sort: mapNameToSortName,
    venueName_sort: event => mapNameToSortName(event.venue),
    bookingType: event =>
      event.bookingType === bookingType.REQUIRED_FOR_NON_MEMBERS
        ? bookingType.REQUIRED
        : event.bookingType,
    area: event => geoUtils.getLondonAreaFromPostcode(event.venue.postcode),
    artsType: event =>
      mapMediumTagsToArtsType(event.mediumTags, event.eventType),
    locationOptimized: mapLocation,
    talents: event => (event.talents || []).map(talent => talent.id),
    externalEventId: mapExternalEventId,
    tags: event =>
      getTagIds(event.geoTags)
        .concat(getTagIds(event.audienceTags))
        .concat(getTagIds(event.mediumTags))
        .concat(
          getTagIds(
            generateMediumWithStyleTags(event.mediumTags, event.styleTags)
          )
        ), // TODO return undefined if no tags
    dates: event =>
      eventDatesGenerator.generate(
        event,
        moment().startOf("day"),
        moment()
          .startOf("day")
          .add(370, "days"),
        namedClosuresLookup.get()
      )
  }
);

export const mapEventForAutocompleteIndex = mappr.compose(
  fpPick(["entityType", "id", "status", "version", "eventType"]),
  event => {
    const simplifiedName = simplify(event.name);
    const simplifiedVenueName = simplify(event.venue.name);
    return {
      output: `${event.name} (${event.venue.name})`,
      nameSuggest: _.uniq([
        simplifiedName,
        simplifiedVenueName,
        removeCommonStartWords(simplifiedName),
        removeCommonStartWords(simplifiedVenueName)
      ])
    };
  }
);

function mapExternalEventId(event) {
  const homepage = _.find(event.links, link => link.type === linkType.HOMEPAGE);
  return homepage && homepage.url
    ? createExternalEventId(event.venue.id, homepage.url)
    : null;
}

function mapMediumTagsToArtsType(mediumTags, eventType) {
  if (mediumTags && mediumTags.length) {
    const mediumTagIds = mediumTags.map(tag => tag.id);

    if (_.intersection(mediumTagIds, mediumType.VISUAL_ARTS).length) {
      return artsType.VISUAL;
    }

    if (_.intersection(mediumTagIds, mediumType.PERFORMING_ARTS).length) {
      return artsType.PERFORMING;
    }

    if (_.intersection(mediumTagIds, mediumType.CREATIVE_WRITING).length) {
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
