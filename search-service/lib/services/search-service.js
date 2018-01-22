'use strict';

const co = require('co');
const zip = require('lodash.zip');
const includes = require('lodash.includes');
const ensure = require('ensure-request').ensure;
const MultiSearchBuilder = require('es-search-builder').MultiSearchBuilder;
const normalise = require('../data/normalise-request');
const msearch = require('../external-services/es-search');
const constants = require('../constants');
const searchBuilders = require('../search/search-builders');
const normalisers = require('../data/normalisers');
const constraints = require('../data/constraints');
const ensureErrorHandler = require('../data/ensure-error-handler');
const mappings = require('../data/mappings');
const time = require('../search/time');

exports.autocompleteSearch = co.wrap(function*(request) {
  normalise(request, normalisers.autocompleteSearch);
  ensure(request, constraints.autocompleteSearch, ensureErrorHandler);

  const msearchBuilder = new MultiSearchBuilder();
  const indexNames = _getAutocompleteIndexesForEntity(request.entityType);

  indexNames.forEach(indexName =>
    searchBuilders.buildSuggestSearch(msearchBuilder, indexName, request.term)
  );

  const msearches = msearchBuilder.build();
  const responses = yield msearch.search(msearches);

  const searchResults = mappings.mapAutocompleteSearchResults(
    responses,
    indexNames
  );

  const items = mappings.getTakeFromSearchResults(
    constants.AUTOCOMPLETE_COMBINED_MAX_RESULTS,
    searchResults
  );

  return items;
});

exports.basicSearch = co.wrap(function*(request, isPublic) {
  normalise(request, normalisers.basicSearch);
  ensure(request, constraints.basicSearch, ensureErrorHandler);

  const msearchBuilder = new MultiSearchBuilder();
  const indexNames = _getBasicSearchIndexesForEntity(request.entityType);

  indexNames.forEach(indexName => {
    const searchBuilder = _getBasicSearchSearchBuilderForIndex(indexName);
    searchBuilder(msearchBuilder, request, isPublic);
  });

  const msearches = msearchBuilder.build();
  const responses = yield msearch.search(msearches);

  const searchResults = indexNames.map((indexName, i) => {
    return mappings.mapSearchResultHitsToItems(responses.responses[i]);
  });

  const hasSingleEntityType = searchResults.length === 1;

  const items = hasSingleEntityType
    ? searchResults[0].items
    : mappings.getTakeFromSearchResults(request.take, searchResults);

  return {
    total: hasSingleEntityType ? searchResults[0].total : items.length,
    items,
    params: request,
  };
});

exports.eventAdvancedSearch = co.wrap(function*(request) {
  normalise(request, normalisers.eventAdvancedSearch);
  ensure(request, constraints.eventAdvancedSearch, ensureErrorHandler);

  request.entityType = constants.ENTITY_TYPE_EVENT;

  const msearchBuilder = new MultiSearchBuilder();
  const searchParams = searchBuilders.createPublicEventSearchParamsFromRequest(
    request
  );
  searchBuilders.buildPublicEventSearch(msearchBuilder, searchParams);
  const msearches = msearchBuilder.build();

  const responses = yield msearch.search(msearches);

  const searchResult = mappings.mapSearchResultHitsToItems(
    responses.responses[0]
  );

  // TODO should be able to remove this when ES v5 available on Bonsai.
  // Also see if can uninstall lodash.includes from this service.
  if (request.dateFrom && request.dateTo) {
    searchResult.items.forEach(item => {
      if (!item.dates) {
        return;
      }

      item.dates = item.dates
        .filter(date => date.date >= request.dateFrom)
        .filter(date => date.date <= request.dateTo);
    });
  }

  // TODO should be able to remove this when ES v5 available on Bonsai.
  if (request.audience) {
    searchResult.items.forEach(item => {
      if (includes(item.tags, request.audience)) {
        return;
      }

      if (!item.dates) {
        return;
      }

      item.dates = item.dates.filter(date =>
        includes(date.tags, request.audience)
      );
    });
  }

  return {
    total: searchResult.total,
    items: searchResult.items,
    params: request,
  };
});

exports.presetSearch = co.wrap(function*(request) {
  ensure(request, constraints.presetSearch, ensureErrorHandler);
  const presetParams = _getPresetSearchParameters(request.name);

  const now = time.getLondonNow();
  const msearchBuilder = new MultiSearchBuilder();

  presetParams.builder(msearchBuilder, request.id, now);
  const msearches = msearchBuilder.build();

  const results = yield msearch.search(msearches);
  const items = presetParams.mapper(results);
  return { items: items, params: request };
});

function _getPresetSearchParameters(presetName) {
  switch (presetName) {
    case constants.FEATURED_EVENTS_SEARCH_PRESET:
      return {
        builder: searchBuilders.buildFeaturedEventsSearchPreset,
        mapper: _hitsListItemsMapper,
      };
    case constants.TALENT_RELATED_EVENTS_SEARCH_PRESET:
      return {
        builder: searchBuilders.buildTalentRelatedEventsSearchPreset,
        mapper: _hitsListItemsMapper,
      };
    case constants.VENUE_RELATED_EVENTS_SEARCH_PRESET:
      return {
        builder: searchBuilders.buildVenueRelatedEventsSearchPreset,
        mapper: _hitsListItemsMapper,
      };
    case constants.EVENT_SERIES_RELATED_EVENTS_SEARCH_PRESET:
      return {
        builder: searchBuilders.buildEventSeriesRelatedEventsSearchPreset,
        mapper: _hitsListItemsMapper,
      };
    case constants.ENTITY_COUNTS_SEARCH_PRESET:
      return {
        builder: searchBuilders.buildEntityCountsSearchPreset,
        mapper: _entityCountsMapper,
      };
    case constants.BY_EXTERNALEVENTID_PRESET:
      return {
        builder: searchBuilders.buildByExternalEventIdPreset,
        mapper: _hitsListItemsMapper,
      };
    default:
      throw new Error(`Preset name out of range: ${presetName}`);
  }
}

function _hitsListItemsMapper(results) {
  const hits = results.responses[0].hits;
  const items = hits.hits.length ? hits.hits.map(hit => hit._source) : [];
  return items;
}

function _entityCountsMapper(results) {
  return zip(
    [
      constants.ENTITY_TYPE_EVENT,
      constants.ENTITY_TYPE_EVENT_SERIES,
      constants.ENTITY_TYPE_TALENT,
      constants.ENTITY_TYPE_VENUE,
    ],
    results.responses
  ).map(element => {
    const entityType = element[0];
    const count = element[1].hits.total;
    return { entityType, count };
  });
}

function _getAutocompleteIndexesForEntity(entityType) {
  switch (entityType) {
    case constants.ENTITY_TYPE_TALENT:
      return [constants.SEARCH_INDEX_TYPE_TALENT_AUTO];
    case constants.ENTITY_TYPE_VENUE:
      return [constants.SEARCH_INDEX_TYPE_VENUE_AUTO];
    case constants.ENTITY_TYPE_EVENT:
      return [constants.SEARCH_INDEX_TYPE_COMBINED_EVENT_AUTO];
    case constants.ENTITY_TYPE_EVENT_SERIES:
      return [constants.SEARCH_INDEX_TYPE_EVENT_SERIES_AUTO];
    default:
      return [
        constants.SEARCH_INDEX_TYPE_TALENT_AUTO,
        constants.SEARCH_INDEX_TYPE_VENUE_AUTO,
        constants.SEARCH_INDEX_TYPE_COMBINED_EVENT_AUTO,
      ];
  }
}

function _getBasicSearchIndexesForEntity(entityType) {
  switch (entityType) {
    case constants.ENTITY_TYPE_TALENT:
      return [constants.SEARCH_INDEX_TYPE_TALENT_FULL];
    case constants.ENTITY_TYPE_VENUE:
      return [constants.SEARCH_INDEX_TYPE_VENUE_FULL];
    case constants.ENTITY_TYPE_EVENT:
      return [constants.SEARCH_INDEX_TYPE_EVENT_FULL];
    case constants.ENTITY_TYPE_EVENT_SERIES:
      return [constants.SEARCH_INDEX_TYPE_EVENT_SERIES_FULL];
    default:
      return [
        constants.SEARCH_INDEX_TYPE_TALENT_FULL,
        constants.SEARCH_INDEX_TYPE_VENUE_FULL,
        constants.SEARCH_INDEX_TYPE_EVENT_SERIES_FULL,
        constants.SEARCH_INDEX_TYPE_EVENT_FULL,
      ];
  }
}

function _getBasicSearchSearchBuilderForIndex(indexName) {
  switch (indexName) {
    case constants.SEARCH_INDEX_TYPE_TALENT_FULL:
      return searchBuilders.buildTalentSearch;
    case constants.SEARCH_INDEX_TYPE_VENUE_FULL:
      return searchBuilders.buildVenueSearch;
    case constants.SEARCH_INDEX_TYPE_EVENT_FULL:
      return searchBuilders.buildEventSearch;
    case constants.SEARCH_INDEX_TYPE_EVENT_SERIES_FULL:
      return searchBuilders.buildEventSeriesSearch;
    default:
      throw new Error(`indexName value out of range: ${indexName}`);
  }
}
