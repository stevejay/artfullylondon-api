import _ from "lodash";
import addDays from "date-fns/addDays";
import looseInterleave from "loose-interleave";
import * as entityType from "../types/entity-type";
import * as presetSearchType from "../types/preset-search-type";
import * as artsType from "../types/arts-type";
import * as areaType from "../types/area-type";
import * as timeUtils from "../time-utils";

const DEFAULT_FIRST = 12;

export function mapBasicSearchParams(params) {
  return {
    ...params,
    ...mapSearchPagingParams(params),
    hasLocation: mapHasLocation(params)
  };
}

export function mapEventAdvancedSearchParams(params) {
  return {
    ...params,
    ...mapSearchPagingParams(params),
    hasLocation: mapHasLocation(params),
    tags: mapTagsForEventSearch(params),
    artsType: mapMediumToCategoryForEventSearch(params),
    hasDates: !!params.dateFrom || !!params.dateTo,
    hasNestedQuery:
      !!params.dateFrom ||
      !!params.dateTo ||
      !!params.timeFrom ||
      !!params.timeTo ||
      !!params.audience
  };
}

export function mapPresetEventAdvancedSearchParams(params) {
  const now = timeUtils.getUtcNow();

  switch (params.name) {
    case presetSearchType.FEATURED_EVENTS:
      return {
        skip: 0,
        take: 24,
        area: areaType.CENTRAL,
        dateFrom: timeUtils.formatAsISODateString(now),
        dateTo: timeUtils.formatAsISODateString(addDays(now, 14))
      };
    case presetSearchType.VENUE_RELATED_EVENTS:
      return {
        skip: 0,
        take: 300,
        venueId: params.id,
        dateFrom: timeUtils.formatAsISODateString(now),
        dateTo: timeUtils.formatAsISODateString(addDays(now, 366))
      };
    case presetSearchType.TALENT_RELATED_EVENTS:
      return {
        skip: 0,
        take: 300,
        talentId: params.id,
        dateFrom: timeUtils.formatAsISODateString(now),
        dateTo: timeUtils.formatAsISODateString(addDays(now, 366))
      };
    case presetSearchType.EVENT_SERIES_RELATED_EVENTS:
      return {
        skip: 0,
        take: 300,
        eventSeriesId: params.id,
        dateFrom: timeUtils.formatAsISODateString(now),
        dateTo: timeUtils.formatAsISODateString(addDays(now, 366))
      };
    default:
      throw new Error(`Unsupported preset search ${params.name}`);
  }
}

export function mapSitemapEventSearchParams() {
  const now = timeUtils.getUtcNow();
  return { dateTo: timeUtils.formatAsISODateString(now) };
}

export function mapEventsByExternalIdsSearchParams(params) {
  return { ids: _.without(params.id.split(","), "") };
}

export function mapAutocompleteSearchResults(result) {
  const options = _.get(result, "suggest.autocomplete[0].options");
  const fuzzyOptions = _.get(result, "suggest.fuzzyAutocomplete[0].options");

  return {
    results: _
      .unionBy(options, fuzzyOptions, "_source.id")
      .map(option => ({ ...option._source, name: option.text }))
  };
}

export function mapBasicSearchResults(result, first) {
  // TODO use mapEventAdvancedSearchResults when is single entity search

  const edgesList = result.responses.map(response =>
    response.hits.hits.map(hit => ({
      node: hit._source,
      cursor: mapFromSortToCursor(hit.sort)
    }))
  );

  const hasSingleEntityType = edgesList.length === 1;
  const edges = hasSingleEntityType
    ? edgesList[0]
    : _.take(looseInterleave.apply(null, edgesList), first);

  if (hasSingleEntityType) {
    return {
      edges,
      pageInfo: {
        hasNextPage: edges.length >= first // TODO how to best determine this?
      }
    };
  } else {
    return {
      edges: edges.map(edge => ({
        node: edge.node,
        cursor: ""
      })),
      pageInfo: {
        hasNextPage: false
      }
    };
  }
}

export function mapEventAdvancedSearchResults(result, first) {
  const edges = result.hits.hits.map(hit => ({
    node: hit._source,
    cursor: mapFromSortToCursor(hit.sort)
  }));

  return {
    edges,
    pageInfo: {
      hasNextPage: edges.length >= first // TODO how to best determine this?
    }
  };
}

export function mapSitemapEventSearchResults(result) {
  return {
    results: result.hits.hits.map(hit => hit._source)
  };
}

// TODO remove?
export function mapSimpleQuerySearchResults(result) {
  return {
    items: result.hits.hits.map(hit => hit._source),
    total: result.hits.total
  };
}

export function mapEntityCountSearchResults(results) {
  return {
    results: _
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
      return artsType.VISUAL;
    case ":all-performing":
      return artsType.PERFORMING;
    case ":all-creative-writing":
      return artsType.CREATIVE_WRITING;
    default:
      throw new Error(`Unknown medium ${src.medium}`);
  }
}

function mapHasLocation(params) {
  return (
    _.isFinite(params.north) &&
    _.isFinite(params.south) &&
    _.isFinite(params.east) &&
    _.isFinite(params.west)
  );
}

function mapSearchPagingParams(params) {
  return {
    first: params.first || DEFAULT_FIRST,
    after: mapFromCursorToSort(params.after)
  };
}

function mapFromSortToCursor(sort) {
  // TODO to base 64
  return JSON.stringify(sort);
}

function mapFromCursorToSort(cursor) {
  // TODO from base 64
  return _.isEmpty(cursor) ? null : JSON.parse(cursor);
}
