import _ from "lodash";
import looseInterleave from "loose-interleave";
import * as entityType from "../types/entity-type";
import * as presetSearchType from "../types/preset-search-type";
import * as time from "../time";

export function mapAutocompleteSearchParams(params) {
  return {
    ...params,
    singleEntitySearch: params.entityType !== entityType.ALL
  };
}

export function mapBasicSearchParams(params) {
  return {
    ...params,
    hasLocation:
      _.isFinite(params.north) &&
      _.isFinite(params.south) &&
      _.isFinite(params.east) &&
      _.isFinite(params.west),
    hasTerm: !!params.term
  };
}

export function mapEventAdvancedSearchParams(params) {
  const mapped = {
    ...params,
    costType: params.cost,
    bookingType: params.booking,
    tags: mapTagsForEventSearch(params),
    artsType: mapMediumToCategoryForEventSearch(params)
  };

  return {
    ...mapped,
    hasTerm: !!mapped.term,
    hasArea: !!mapped.area,
    hasArtsType: !!mapped.artsType,
    hasCostType: !!mapped.cost,
    hasBookingType: !!mapped.booking,
    hasVenueId: !!mapped.venueId,
    hasTalentId: !!mapped.talentId,
    hasEventSeriesId: !!mapped.eventSeriesId,
    hasTags: !_.isEmpty(mapped.tags),
    hasDates: !!mapped.dateFrom || !!mapped.dateTo,
    hasNestedQuery:
      !!mapped.dateFrom ||
      !!mapped.dateTo ||
      !!mapped.timeFrom ||
      !!mapped.timeTo ||
      !!mapped.audience,
    hasDateFrom: !!mapped.dateFrom,
    hasDateTo: !!mapped.dateTo,
    hasTimeFrom: !!mapped.timeFrom,
    hasTimeTo: !!mapped.timeTo,
    hasAudience: !!mapped.audience
  };
}

export function mapPresetEventAdvancedSearchParams(params) {
  const now = time.getLondonNow();

  switch (params.name) {
    case presetSearchType.FEATURED_EVENTS:
      return {
        skip: 0,
        take: 24,
        area: "Central",
        dateFrom: time.formatAsStringDate(now),
        dateTo: time.formatAsStringDate(now.add(14, "days"))
      };
    case presetSearchType.VENUE_RELATED_EVENTS:
      return {
        skip: 0,
        take: 300,
        venueId: params.id,
        dateFrom: time.formatAsStringDate(now),
        dateTo: time.formatAsStringDate(now.add(366, "days"))
      };
    case presetSearchType.TALENT_RELATED_EVENTS:
      return {
        skip: 0,
        take: 300,
        talentId: params.id,
        dateFrom: time.formatAsStringDate(now),
        dateTo: time.formatAsStringDate(now.add(366, "days"))
      };
    case presetSearchType.EVENT_SERIES_RELATED_EVENTS:
      return {
        skip: 0,
        take: 300,
        eventSeriesId: params.id,
        dateFrom: time.formatAsStringDate(now),
        dateTo: time.formatAsStringDate(now.add(366, "days"))
      };
    default:
      throw new Error(`Unsupported preset search ${params.name}`);
  }
}

export function mapSitemapEventIdsSearchParams() {
  const now = time.getLondonNow();

  return {
    dateTo: time.formatAsStringDate(now)
  };
}

export function mapEventsByExternalIdsSearchParams(params) {
  return {
    ids: params.id.split(",")
  };
}

export function mapAutocompleteSearchResults(result) {
  const options = _.get(result, "suggest.autocomplete[0].options");
  const fuzzyOptions = _.get(result, "suggest.fuzzyAutocomplete[0].options");

  return {
    items: _
      .unionBy(options, fuzzyOptions, "_source.id")
      .map(option => ({ ...option._source, name: option.text }))
  };
}

export function mapBasicSearchResults(results, take) {
  const mapped = results.responses.map(mapSimpleQuerySearchResults);
  const hasSingleEntityType = mapped.length === 1;

  const items = hasSingleEntityType
    ? mapped[0].items
    : _.take(
        looseInterleave.apply(null, mapped.map(element => element.items)),
        take
      );

  const total = hasSingleEntityType ? mapped[0].total : items.length;
  return { items, total };
}

export function mapSimpleQuerySearchResults(result) {
  return {
    items: result.hits.hits.map(hit => hit._source),
    total: result.hits.total
  };
}

export function mapEntityCountsSearchResults(results) {
  return {
    items: _
      .zip(
        [
          entityType.EVENT,
          entityType.EVENT_SERIES,
          entityType.TALENT,
          entityType.VENUE
        ],
        results.responses
      )
      .map(element => ({
        entityType: element[0],
        count: element[1].hits.total
      }))
  };
}

function mapTagsForEventSearch(src) {
  if (!src.medium || src.medium.startsWith(":")) {
    return undefined;
  }

  if (!src.style) {
    return [src.medium];
  }

  const styleId = src.style.slice(5); // removes initial 'style' text
  return [src.medium + styleId];
}

function mapMediumToCategoryForEventSearch(src) {
  if (!src.medium || !src.medium.startsWith(":")) {
    return undefined;
  }

  switch (src.medium) {
    case ":all-visual":
      return "Visual";
    case ":all-performing":
      return "Performing";
    case ":all-creative-writing":
      return "CreativeWriting";
    default:
      throw new Error(`Unknown medium ${src.medium}`);
  }
}
