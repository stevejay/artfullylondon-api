import _ from "lodash";
import fpPick from "lodash/fp/pick";
import mappr from "mappr";
import latinize from "latinize";
import simplify from "es-simplify";
import * as bookingType from "../../types/booking-type";
import * as entityType from "../../types/entity-type";
import * as geoMappings from "./geo-mappings";
import * as tagMappings from "./tag-mappings";
import * as datesMappings from "./dates-mappings";
import * as idMappings from "./id-mappings";

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

export const mapTalentForEntityIndex = mappr.compose(
  () => ({ entityType: entityType.TALENT }),
  fpPick([
    "id",
    "status",
    "firstNames",
    "lastName",
    "talentType",
    "commonRole",
    "version"
  ]),
  mapMainImage,
  {
    name: mapTalentName,
    lastName_sort: mapNameToSortName
  }
);

export const mapTalentForAutocompleteIndex = mappr.compose(
  () => ({ entityType: entityType.TALENT }),
  fpPick(["id", "status", "talentType", "commonRole", "version"]),
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

export const mapVenueForEntityIndex = mappr.compose(
  () => ({ entityType: entityType.VENUE }),
  fpPick([
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
    locationOptimized: geoMappings.mapLocation
  }
);

export const mapVenueForAutocompleteIndex = mappr.compose(
  () => ({ entityType: entityType.VENUE }),
  fpPick(["id", "status", "version", "venueType", "address", "postcode"]),
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

export const mapEventSeriesForEntityIndex = mappr.compose(
  () => ({ entityType: entityType.EVENT_SERIES }),
  fpPick([
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
  () => ({ entityType: entityType.EVENT_SERIES }),
  fpPick(["id", "status", "version"]),
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

export const mapEventForEntityIndex = mappr.compose(
  () => ({ entityType: entityType.EVENT }),
  fpPick([
    "id",
    "status",
    "name",
    "eventType",
    "occurrenceType",
    "costType",
    "summary",
    "rating",
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
    area: geoMappings.mapLondonArea,
    artsType: tagMappings.mapArtsType,
    locationOptimized: event => geoMappings.mapLocation(event.venue),
    talents: event => (event.talents || []).map(talent => talent.talent.id),
    externalEventId: idMappings.mapExternalEventId,
    tags: tagMappings.mapTags,
    dates: datesMappings.mapDates
  }
);

export const mapEventForAutocompleteIndex = mappr.compose(
  () => ({ entityType: entityType.EVENT }),
  fpPick(["id", "status", "version", "eventType"]),
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
