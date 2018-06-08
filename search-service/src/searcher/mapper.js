import _ from "lodash";
import looseInterleave from "loose-interleave";
import * as entityType from "../entity-type";
import * as searchPresetType from "../search-preset-type";
import * as time from "./time";

export function mapAutocompleteSearchParams(params) {
  return {
    ...params,
    singleEntitySearch: params.entityType !== entityType.ALL
  };
}

export function mapBasicSearchParams(params) {
  return {
    ...params,
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
    case searchPresetType.FEATURED_EVENTS:
      return {
        skip: 0,
        take: 24,
        area: "Central",
        dateFrom: time.formatAsStringDate(now),
        dateTo: time.formatAsStringDate(now.add(14, "days"))
      };
    case searchPresetType.VENUE_RELATED_EVENTS:
      return {
        skip: 0,
        take: 300,
        venueId: params.id,
        dateFrom: time.formatAsStringDate(now),
        dateTo: time.formatAsStringDate(now.add(366, "days"))
      };
    case searchPresetType.TALENT_RELATED_EVENTS:
      return {
        skip: 0,
        take: 300,
        talentId: params.id,
        dateFrom: time.formatAsStringDate(now),
        dateTo: time.formatAsStringDate(now.add(366, "days"))
      };
    case searchPresetType.EVENT_SERIES_RELATED_EVENTS:
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

export function mapAutocompleteSearchResults(result) {
  return {
    items: _
      .unionBy(
        result.suggest.autocomplete[0].options,
        result.suggest.fuzzyAutocomplete[0].options,
        "_source.id"
      )
      .map(option => ({ ...option._source, name: option.text }))
  };
}

export function mapBasicSearchResults(results, take) {
  const mapped = results.responses.map(response => ({
    items: response.hits.hits.map(hit => hit._source),
    total: response.hits.total
  }));

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

export function mapEventAdvancedSearchResults(result) {
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