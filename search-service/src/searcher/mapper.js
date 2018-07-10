import _ from "lodash";
import simplify from "es-simplify";
import looseInterleave from "loose-interleave";
import * as entityType from "../types/entity-type";
import * as artsType from "../types/arts-type";
import * as timeUtils from "../time-utils";

const DEFAULT_FIRST = 12;

export function mapAutocompleteSearchParams(params) {
  return {
    ...params,
    term: simplify(params.term)
  };
}

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

export function mapSitemapEventSearchParams() {
  const now = timeUtils.getUtcNow();
  return { dateTo: timeUtils.formatAsIsoShortDateString(now) };
}

export function mapAutocompleteSearchResults(result) {
  const options = _.get(result, "suggest.autocomplete[0].options");
  const fuzzyOptions = _.get(result, "suggest.fuzzyAutocomplete[0].options");

  return {
    results: _
      .unionBy(options, fuzzyOptions, "_source.id")
      .map(option => ({ ...option._source, name: option._source.output }))
  };
}

export function mapBasicSearchResults(result, first) {
  const hasSingleEntityType = result.responses.length === 1;
  if (hasSingleEntityType) {
    return mapSingleEntitySearchResults(result.responses[0], first);
  }

  const edgesList = result.responses.map(response =>
    response.hits.hits.map(hit => ({
      node: hit._source,
      cursor: mapFromSortToCursor(hit.sort)
    }))
  );

  const edges = _.take(looseInterleave.apply(null, edgesList), first);

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

export function mapEventAdvancedSearchResults(result, first) {
  return mapSingleEntitySearchResults(result, first);
}

function mapSingleEntitySearchResults(result, first) {
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
