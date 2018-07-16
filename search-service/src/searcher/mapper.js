import _ from "lodash";
import simplify from "es-simplify";
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

export function mapAutocompleteSearchResults(result, type) {
  const take = type ? 5 : 3;
  const mapped = _.take(
    _.flatten(
      entityType.ALLOWED_VALUES.map(type =>
        mapAutocompleteSearchResultsForEntity(result, type, take)
      )
    ),
    12
  );
  return { results: mapped };
}

function mapAutocompleteSearchResultsForEntity(result, type, take) {
  const options = _.get(result, `suggest.${type}[0].options`);
  const fuzzyOptions = _.get(result, `suggest.${type}_fuzzy[0].options`);
  return _.take(
    _.unionBy(options, fuzzyOptions, "_source.id").map(option => {
      const result = { ...option._source };
      result.name = result.output;
      delete result.output;
      return result;
    }),
    take
  );
}

export function mapEntitySearchResults(result, first) {
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
    results: entityType.ALLOWED_VALUES.map(type => ({
      entityType: type,
      count: results.aggregations[type].doc_count || 0
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
