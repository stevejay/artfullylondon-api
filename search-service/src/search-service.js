import _ from "lodash";
import { MultiSearchBuilder } from "es-search-builder";
import * as msearch from "./es-search";
import * as constants from "./constants";
import * as searchBuilders from "./search/search-builders";
import * as normaliser from "./normaliser";
import * as validator from "./validator";
import * as mapper from "./domain/mapper";
import * as time from "./search/time";
import * as entityType from "./entity-type";
import * as searchIndexType from "./search-index-type";
import * as searchPresetType from "./search-preset-type";

export async function autocompleteSearch(request) {
  request = normaliser.normaliseAutocompleteSearchRequest(request);
  validator.validateAutocompleteSearchRequest(request);

  const msearchBuilder = new MultiSearchBuilder();
  const indexNames = _getAutocompleteIndexesForEntity(request.entityType);

  indexNames.forEach(indexName =>
    searchBuilders.buildSuggestSearch(msearchBuilder, indexName, request.term)
  );

  const msearches = msearchBuilder.build();
  const responses = await msearch.search(msearches);

  const searchResults = mapper.mapAutocompleteSearchResults(
    responses,
    indexNames
  );

  const items = mapper.getTakeFromSearchResults(
    constants.AUTOCOMPLETE_COMBINED_MAX_RESULTS,
    searchResults
  );

  return { items, params: request };
}

export async function basicSearch(request) {
  request = normaliser.normaliseBasicSearchRequest(request);
  validator.validateBasicSearchRequest(request);

  const msearchBuilder = new MultiSearchBuilder();
  const indexNames = _getBasicSearchIndexesForEntity(request.entityType);

  indexNames.forEach(indexName => {
    const searchBuilder = _getBasicSearchSearchBuilderForIndex(indexName);
    searchBuilder(msearchBuilder, request, request.isPublic);
  });

  const msearches = msearchBuilder.build();
  const responses = await msearch.search(msearches);

  const searchResults = indexNames.map((indexName, i) => {
    return mapper.mapSearchResultHitsToItems(responses.responses[i]);
  });

  const hasSingleEntityType = searchResults.length === 1;

  const items = hasSingleEntityType
    ? searchResults[0].items
    : mapper.getTakeFromSearchResults(request.take, searchResults);

  return {
    total: hasSingleEntityType ? searchResults[0].total : items.length,
    items,
    params: request
  };
}

export async function eventAdvancedSearch(request) {
  request = normaliser.normaliseEventAdvancedSearchRequest(request);
  validator.validateEventAdvancedSearchRequest(request);

  request.entityType = entityType.EVENT;

  const msearchBuilder = new MultiSearchBuilder();
  const searchParams = searchBuilders.createPublicEventSearchParamsFromRequest(
    request
  );
  searchBuilders.buildPublicEventSearch(msearchBuilder, searchParams);
  const msearches = msearchBuilder.build();

  const responses = await msearch.search(msearches);

  const searchResult = mapper.mapSearchResultHitsToItems(
    responses.responses[0]
  );

  // TODO should be able to remove this when ES v5 available on Bonsai.
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
      if (_.includes(item.tags, request.audience)) {
        return;
      }

      if (!item.dates) {
        return;
      }

      item.dates = item.dates.filter(date =>
        _.includes(date.tags, request.audience)
      );
    });
  }

  return {
    total: searchResult.total,
    items: searchResult.items,
    params: request
  };
}

export async function presetSearch(request) {
  validator.validatePresetSearch(request);
  const presetParams = _getPresetSearchParameters(request.name);

  const now = time.getLondonNow();
  const msearchBuilder = new MultiSearchBuilder();

  presetParams.builder(msearchBuilder, request.id, now);
  const msearches = msearchBuilder.build();

  const results = await msearch.search(msearches);
  const items = presetParams.mapper(results);
  return { items: items, params: request };
}

function _getPresetSearchParameters(presetName) {
  switch (presetName) {
    case searchPresetType.FEATURED_EVENTS:
      return {
        builder: searchBuilders.buildFeaturedEventsSearchPreset,
        mapper: _hitsListItemsMapper
      };
    case searchPresetType.TALENT_RELATED_EVENTS:
      return {
        builder: searchBuilders.buildTalentRelatedEventsSearchPreset,
        mapper: _hitsListItemsMapper
      };
    case searchPresetType.VENUE_RELATED_EVENTS:
      return {
        builder: searchBuilders.buildVenueRelatedEventsSearchPreset,
        mapper: _hitsListItemsMapper
      };
    case searchPresetType.EVENT_SERIES_RELATED_EVENTS:
      return {
        builder: searchBuilders.buildEventSeriesRelatedEventsSearchPreset,
        mapper: _hitsListItemsMapper
      };
    case searchPresetType.ENTITY_COUNTS:
      return {
        builder: searchBuilders.buildEntityCountsSearchPreset,
        mapper: _entityCountsMapper
      };
    case searchPresetType.BY_EXTERNALEVENTID:
      return {
        builder: searchBuilders.buildByExternalEventIdPreset,
        mapper: _hitsListItemsMapper
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
  return _
    .zip(
      [
        entityType.EVENT,
        entityType.EVENT_SERIES,
        entityType.TALENT,
        entityType.VENUE
      ],
      results.responses
    )
    .map(element => {
      const count = element[1].hits.total;
      return { entityType: element[0], count };
    });
}

function _getAutocompleteIndexesForEntity(entity) {
  switch (entity) {
    case entityType.TALENT:
      return [searchIndexType.TALENT_AUTO];
    case entityType.VENUE:
      return [searchIndexType.VENUE_AUTO];
    case entityType.EVENT:
      return [searchIndexType.COMBINED_EVENT_AUTO];
    case entityType.EVENT_SERIES:
      return [searchIndexType.EVENT_SERIES_AUTO];
    default:
      return [
        searchIndexType.TALENT_AUTO,
        searchIndexType.VENUE_AUTO,
        searchIndexType.COMBINED_EVENT_AUTO
      ];
  }
}

function _getBasicSearchIndexesForEntity(entity) {
  switch (entity) {
    case entityType.TALENT:
      return [searchIndexType.TALENT_FULL];
    case entityType.VENUE:
      return [searchIndexType.VENUE_FULL];
    case entityType.EVENT:
      return [searchIndexType.EVENT_FULL];
    case entityType.EVENT_SERIES:
      return [searchIndexType.EVENT_SERIES_FULL];
    default:
      return [
        searchIndexType.TALENT_FULL,
        searchIndexType.VENUE_FULL,
        searchIndexType.EVENT_SERIES_FULL,
        searchIndexType.EVENT_FULL
      ];
  }
}

function _getBasicSearchSearchBuilderForIndex(indexName) {
  switch (indexName) {
    case searchIndexType.TALENT_FULL:
      return searchBuilders.buildTalentSearch;
    case searchIndexType.VENUE_FULL:
      return searchBuilders.buildVenueSearch;
    case searchIndexType.EVENT_FULL:
      return searchBuilders.buildEventSearch;
    case searchIndexType.EVENT_SERIES_FULL:
      return searchBuilders.buildEventSeriesSearch;
    default:
      throw new Error(`indexName value out of range: ${indexName}`);
  }
}
