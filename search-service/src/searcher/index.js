import * as esClient from "./elasticsearch-client";
import * as mapper from "./mapper";
import * as queryFactory from "./query-factory";
import * as presetSearchType from "../types/preset-search-type";

export async function autocompleteSearch(params) {
  const searchParams = mapper.mapAutocompleteSearchParams(params);
  const search = queryFactory.createAutocompleteSearch(searchParams);
  const results = await esClient.search(search);
  return mapper.mapAutocompleteSearchResults(results);
}

export async function basicSearch(params) {
  const searchParams = mapper.mapBasicSearchParams(params);
  const searches = queryFactory.createBasicSearchSearches(searchParams);
  const results = await esClient.multiSearch(searches);
  return mapper.mapBasicSearchResults(results, params.take);
}

export async function eventAdvancedSearch(params) {
  const searchParams = mapper.mapEventAdvancedSearchParams(params);
  const search = queryFactory.createEventAdvancedSearch(searchParams);
  const results = await esClient.search(search);
  return mapper.mapSimpleQuerySearchResults(results);
}

export async function presetSearch(params) {
  switch (params.name) {
    case presetSearchType.ENTITY_COUNTS:
      return await presetEntityCountsSearch();
    case presetSearchType.SITEMAP_EVENT_IDS:
      return await presetSitemapEventIdsSearch(params);
    case presetSearchType.EVENTS_BY_EXTERNAL_IDS:
      return await presetEventsByExternalIds(params);
    default:
      return await presetEventAdvancedSearch(params);
  }
}

async function presetEntityCountsSearch() {
  const searches = queryFactory.createEntityCountsSearches();
  const results = await esClient.multiSearch(searches);
  return mapper.mapEntityCountsSearchResults(results);
}

async function presetSitemapEventIdsSearch(params) {
  const searchParams = mapper.mapSitemapEventIdsSearchParams(params);
  const search = queryFactory.createSitemapEventIdsSearch(searchParams);
  const results = await esClient.search(search);
  return mapper.mapSimpleQuerySearchResults(results);
}

async function presetEventsByExternalIds(params) {
  const searchParams = mapper.mapEventsByExternalIdsSearchParams(params);
  const search = queryFactory.createEventsByExternalIdsSearch(searchParams);
  const results = await esClient.search(search);
  return mapper.mapSimpleQuerySearchResults(results);
}

async function presetEventAdvancedSearch(params) {
  const presetParams = mapper.mapPresetEventAdvancedSearchParams(params);
  return await eventAdvancedSearch(presetParams);
}
