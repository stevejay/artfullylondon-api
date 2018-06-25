import * as normaliser from "./normaliser";
import * as validator from "./validator";
import * as searcher from "./searcher";

export async function autocompleteSearch(request) {
  const search = normaliser.normaliseAutocompleteSearchRequest(request);
  validator.validateAutocompleteSearchRequest(search);
  const result = await searcher.autocompleteSearch(search);
  return { ...result, params: search };
}

export async function basicSearch(request) {
  const search = normaliser.normaliseBasicSearchRequest(request);
  validator.validateBasicSearchRequest(search);
  const result = await searcher.basicSearch(search);
  return { ...result, params: search };
}

export async function eventAdvancedSearch(request) {
  const search = normaliser.normaliseEventAdvancedSearchRequest(request);
  validator.validateEventAdvancedSearchRequest(search);
  const result = await searcher.eventAdvancedSearch(search);
  return { ...result, params: search };
}

export async function presetSearch(request) {
  const search = normaliser.normalisePresetSearchRequest(request);
  validator.validatePresetSearch(search);
  const result = await searcher.presetSearch(search);
  return { ...result, params: search };
}
