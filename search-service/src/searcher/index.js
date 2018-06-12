import * as esClient from "../elasticsearch-client";
import * as mapper from "./mapper";
import * as queryFactory from "./query-factory";
import * as searchIndexType from "../types/search-index-type";
import * as searchTemplateType from "./search-template-type";
import * as presetSearchType from "../types/preset-search-type";

export async function autocompleteSearch(params) {
  const templateParams = mapper.mapAutocompleteSearchParams(params);
  const results = await esClient.templateSearch(
    searchTemplateType.AUTOCOMPLETE,
    searchIndexType.AUTOCOMPLETE,
    templateParams
  );
  return mapper.mapAutocompleteSearchResults(results);
}

export async function basicSearch(params) {
  const templateParams = mapper.mapBasicSearchParams(params);
  const searches = queryFactory.createBasicSearchTemplateSearches(
    templateParams
  );
  const results = await esClient.templateMultiSearch(searches);
  return mapper.mapBasicSearchResults(results, params.take);
}

export async function eventAdvancedSearch(params) {
  const templateParams = mapper.mapEventAdvancedSearchParams(params);
  const results = await esClient.templateSearch(
    searchTemplateType.EVENT_ADVANCED,
    searchIndexType.EVENT,
    templateParams
  );
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

async function presetEventAdvancedSearch(params) {
  const presetParams = mapper.mapPresetEventAdvancedSearchParams(params);
  return await eventAdvancedSearch(presetParams);
}

async function presetEntityCountsSearch() {
  const searches = queryFactory.createEntityCountsSearches();
  const results = await esClient.multiSearch(searches);
  return mapper.mapEntityCountsSearchResults(results);
}

async function presetSitemapEventIdsSearch(params) {
  const templateParams = mapper.mapSitemapEventIdsSearchParams(params);
  const results = await esClient.templateSearch(
    searchTemplateType.SITEMAP_EVENT_IDS,
    searchIndexType.EVENT,
    templateParams
  );
  return mapper.mapSimpleQuerySearchResults(results);
}

async function presetEventsByExternalIds(params) {
  const templateParams = mapper.mapEventsByExternalIdsSearchParams(params);
  const results = await esClient.templateSearch(
    searchTemplateType.EVENTS_BY_EXTERNAL_IDS,
    searchIndexType.EVENT,
    templateParams
  );
  return mapper.mapSimpleQuerySearchResults(results);
}
