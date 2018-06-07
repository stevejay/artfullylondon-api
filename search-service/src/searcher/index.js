import * as elasticsearch from "./elasticsearch";
import * as mapper from "./mapper";
import * as queryFactory from "./query-factory";

export async function autocompleteSearch(params) {
  const query = queryFactory.createAutocompleteSearchQuery(params);
  const result = await elasticsearch.search(query);
  return mapper.mapAutocompleteSearchResult(result);
}

export async function basicSearch(params) {
  const searches = queryFactory.createBasicSearchSearches(params);
  const results = await elasticsearch.multiSearch(searches);
  return mapper.mapBasicSearchResults(results, params.take);
}

export async function eventAdvancedSearch(params) {
  params = mapper.mapEventSearchParams(params);
  const query = queryFactory.createEventAdvancedSearch(params);
  const result = await elasticsearch.search(query);
  return mapper.mapEventAdvancedSearchResults(result);
}

export async function presetSearch(params) {
  const searches = queryFactory.createPresetSearches(params);
  const results = await elasticsearch.multiSearch(searches);
  return mapper.mapPresetSearchResults(results, params.name);
}
