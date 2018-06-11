import * as normaliser from "./normaliser";
import * as validator from "./validator";
import * as searcher from "./searcher";
import * as indexer from "./indexer";

export async function autocompleteSearch(request) {
  request = normaliser.normaliseAutocompleteSearchRequest(request);
  validator.validateAutocompleteSearchRequest(request);
  const result = await searcher.autocompleteSearch(request);
  return { ...result, params: request };
}

export async function basicSearch(request) {
  request = normaliser.normaliseBasicSearchRequest(request);
  validator.validateBasicSearchRequest(request);
  const result = await searcher.basicSearch(request);
  return { ...result, params: request };
}

export async function eventAdvancedSearch(request) {
  request = normaliser.normaliseEventAdvancedSearchRequest(request);
  validator.validateEventAdvancedSearchRequest(request);
  const result = await searcher.eventAdvancedSearch(request);
  return { ...result, params: request };
}

export async function presetSearch(request) {
  validator.validatePresetSearch(request);
  const result = await searcher.presetSearch(request);
  return { ...result, params: request };
}

export async function indexDocument(request) {
  validator.validateIndexDocumentRequest(request);
  await indexer.index(request);
  return { acknowledged: true };
}
