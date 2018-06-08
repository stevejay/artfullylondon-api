import _ from "lodash";
import * as esClient from "./elasticsearch-client";
import * as mapper from "./mapper";
import * as queryFactory from "./query-factory";
import * as searchTemplateType from "./search-template-type";
import * as searchIndexType from "../search-index-type";

export async function autocompleteSearch(params) {
  const result = await esClient.searchUsingTemplate(
    searchTemplateType.AUTOCOMPLETE,
    searchIndexType.AUTOCOMPLETE,
    mapper.mapAutocompleteSearchParams(params)
  );
  return mapper.mapAutocompleteSearchResult(result);
}

export async function basicSearch(params) {
  const searches = queryFactory.createBasicSearchSearches(params);
  const results = await esClient.multiSearch(searches);
  return mapper.mapBasicSearchResults(results, params.take);
}

export async function eventAdvancedSearch(params) {
  params = mapper.mapEventSearchParams(params);
  const query = queryFactory.createEventAdvancedSearch(params);
  const result = await esClient.search(query);
  return mapper.mapEventAdvancedSearchResults(result);
}

export async function presetSearch(params) {
  const search = queryFactory.createPresetSearch(params);
  const results = _.isArray(search)
    ? await esClient.multiSearch(search)
    : await esClient.search(search);
  return mapper.mapPresetSearchResults(results, params.name);
}
