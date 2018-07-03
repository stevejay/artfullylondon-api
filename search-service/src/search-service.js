import * as normaliser from "./normaliser";
import * as validator from "./validator";
import * as searcher from "./searcher";

export async function autocompleteSearch(request) {
  const search = normaliser.normaliseAutocompleteSearchRequest(request);
  validator.validateAutocompleteSearchRequest(search);
  return await searcher.autocompleteSearch(search);
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
