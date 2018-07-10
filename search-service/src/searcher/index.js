import * as esClient from "./elasticsearch-client";
import * as mapper from "./mapper";
import * as queryFactory from "./query-factory";

export async function autocompleteSearch(params) {
  const searchParams = mapper.mapAutocompleteSearchParams(params);
  const search = queryFactory.createAutocompleteSearch(searchParams);
  const results = await esClient.search(search);
  return mapper.mapAutocompleteSearchResults(results, searchParams.entityType);
}

export async function basicSearch(params) {
  const searchParams = mapper.mapBasicSearchParams(params);
  const searches = queryFactory.createBasicSearchSearches(searchParams);
  const results = await esClient.multiSearch(searches);
  return mapper.mapBasicSearchResults(results, searchParams.first);
}

export async function eventAdvancedSearch(params) {
  const searchParams = mapper.mapEventAdvancedSearchParams(params);
  const search = queryFactory.createEventAdvancedSearch(searchParams);
  const results = await esClient.search(search);
  return mapper.mapEventAdvancedSearchResults(results, searchParams.first);
}

export async function entityCountSearch() {
  const searches = queryFactory.createEntityCountSearches();
  const results = await esClient.multiSearch(searches);
  return mapper.mapEntityCountSearchResults(results);
}

export async function sitemapEventSearch() {
  const searchParams = mapper.mapSitemapEventSearchParams();
  const search = queryFactory.createSitemapEventSearch(searchParams);
  const results = await esClient.search(search);
  return mapper.mapSitemapEventSearchResults(results);
}
