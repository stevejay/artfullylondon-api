import esb from "elastic-builder/src";
import * as constants from "./constants";
import * as entityType from "../entity-type";
import * as searchPresetType from "../search-preset-type";
import * as searchIndexType from "../search-index-type";
import * as time from "./time";

const DOC_TYPE_NAME = "doc";

export function createPresetSearches(params) {
  switch (params.name) {
    case searchPresetType.FEATURED_EVENTS:
      return createFeaturedEventsSearchPreset(params);
    case searchPresetType.ENTITY_COUNTS:
      return createEntityCountsSearchPreset();
    case searchPresetType.VENUE_RELATED_EVENTS:
      return createVenueRelatedEventsSearchPreset(params);
    case searchPresetType.TALENT_RELATED_EVENTS:
      return createTalentRelatedEventsSearchPreset(params);
    case searchPresetType.EVENT_SERIES_RELATED_EVENTS:
      return createEventSeriesRelatedEventsSearchPreset(params);
    default:
      throw new Error(`Unsupported preset name ${params.name}`);
  }
}

function createEventSeriesRelatedEventsSearchPreset(params) {
  const now = time.getLondonNow();

  const advancedSearchParams = {
    skip: 0,
    take: 300,
    eventSeriesId: params.id,
    dateFrom: time.formatAsStringDate(now),
    dateTo: time.formatAsStringDate(now.add(366, "days")),
    source: constants.SUMMARY_EVENT_SOURCE_FIELDS
  };

  return createEventAdvancedSearch(advancedSearchParams);
}

function createVenueRelatedEventsSearchPreset(params) {
  const now = time.getLondonNow();

  const advancedSearchParams = {
    skip: 0,
    take: 300,
    venueId: params.id,
    dateFrom: time.formatAsStringDate(now),
    dateTo: time.formatAsStringDate(now.add(366, "days")),
    source: constants.SUMMARY_EVENT_SOURCE_FIELDS
  };

  return createEventAdvancedSearch(advancedSearchParams);
}

function createTalentRelatedEventsSearchPreset(params) {
  const now = time.getLondonNow();

  const advancedSearchParams = {
    skip: 0,
    take: 300,
    talentId: params.id,
    dateFrom: time.formatAsStringDate(now),
    dateTo: time.formatAsStringDate(now.add(366, "days")),
    source: constants.SUMMARY_EVENT_SOURCE_FIELDS
  };

  return createEventAdvancedSearch(advancedSearchParams);
}

function createEntityCountsSearchPreset() {
  const searches = [];

  [
    searchIndexType.EVENT_FULL,
    searchIndexType.EVENT_SERIES_FULL,
    searchIndexType.TALENT_FULL,
    searchIndexType.VENUE_FULL
  ].forEach(index => {
    searches.push({ index, type: DOC_TYPE_NAME });
    searches.push(
      esb
        .requestBodySearch()
        .size(0)
        .toJSON()
    );
  });

  return searches;
}

function createFeaturedEventsSearchPreset() {
  const now = time.getLondonNow();

  const advancedSearchParams = {
    skip: 0,
    take: 24,
    area: "Central",
    dateFrom: time.formatAsStringDate(now),
    dateTo: time.formatAsStringDate(now.add(14, "days")),
    source: constants.SUMMARY_EVENT_SOURCE_FIELDS
  };

  return createEventAdvancedSearch(advancedSearchParams);
}

export function createEventAdvancedSearch(params) {
  const query = esb.boolQuery();

  if (params.isPublic) {
    query.filter(esb.termQuery("status", "Active"));
  }

  if (params.term) {
    query
      .should([
        esb.matchQuery("name", params.term),
        esb.matchQuery("venueName", params.term),
        esb.matchQuery("summary", params.term)
      ])
      .minimumShouldMatch(1);
  }

  if (params.area) {
    query.filter(esb.termQuery("area", params.area));
  }

  if (params.location) {
    query.filter(
      esb
        .geoBoundingBoxQuery("locationOptimized")
        .topLeft(
          esb
            .geoPoint()
            .lat(params.location.north)
            .lon(params.location.west)
        )
        .bottomRight(
          esb
            .geoPoint()
            .lat(params.location.south)
            .lon(params.location.east)
        )
        .type("indexed")
    );
  }

  if (params.tags) {
    params.tags.forEach(tag => query.filter(esb.termQuery("tags", tag)));
  }

  if (params.artsType) {
    query.filter(esb.termQuery("artsType", params.artsType));
  }

  if (params.costType) {
    query.filter(esb.termQuery("costType", params.costType));
  }

  if (params.bookingType) {
    query.filter(esb.termQuery("bookingType", params.bookingType));
  }

  if (params.venueId) {
    query.filter(esb.termQuery("venueId", params.venueId));
  }

  if (params.talentId) {
    query.filter(esb.termQuery("talents", params.talentId));
  }

  if (params.eventSeriesId) {
    query.filter(esb.termQuery("eventSeriesId", params.eventSeriesId));
  }

  // TODO rethink how audience search is handled.

  if (
    params.dateFrom ||
    params.dateTo ||
    params.timeFrom ||
    params.timeTo ||
    params.audience
  ) {
    const nestedQuery = esb.boolQuery();

    if (params.dateFrom) {
      nestedQuery.filter(esb.rangeQuery("dates.date").gte(params.dateFrom));
    }

    if (params.dateTo) {
      nestedQuery.filter(esb.rangeQuery("dates.date").lte(params.dateTo));
    }

    if (params.timeFrom) {
      nestedQuery.filter(esb.rangeQuery("dates.to").gt(params.timeFrom));
    }

    if (params.timeTo) {
      nestedQuery.filter(esb.rangeQuery("dates.from").lte(params.timeTo));
    }

    if (params.audience) {
      nestedQuery.filter(esb.rangeQuery("dates.tags").lte(params.audience));
    }

    query.filter(
      esb
        .nestedQuery()
        .path("dates")
        .query(nestedQuery)
    );
  }

  let defaultSource = constants.SUMMARY_EVENT_SOURCE_FIELDS;

  if (params.dateFrom && params.dateTo) {
    defaultSource = [...defaultSource, "dates"];
  }

  return {
    index: searchIndexType.EVENT_FULL,
    type: DOC_TYPE_NAME,
    body: esb
      .requestBodySearch()
      .size(params.take)
      .from(params.skip)
      .source(params.source || defaultSource)
      .sorts([esb.sort("_score", "desc"), esb.sort("name_sort")])
      .query(query)
      .toJSON()
  };
}

export function createAutocompleteSearchQuery(params) {
  const completionSuggester = esb
    .completionSuggester("autocomplete", "nameSuggest")
    .prefix(params.term)
    .size(constants.AUTOCOMPLETE_MAX_RESULTS);

  const fuzzyCompletionSuggester = esb
    .completionSuggester("fuzzyAutocomplete", "nameSuggest")
    .prefix(params.term)
    .size(constants.AUTOCOMPLETE_MAX_RESULTS)
    .fuzzy(true);

  if (params.entityType !== entityType.ALL) {
    completionSuggester.contexts("entityType", [params.entityType]);
    fuzzyCompletionSuggester.contexts("entityType", [params.entityType]);
  }

  return {
    index: searchIndexType.AUTOCOMPLETE,
    type: DOC_TYPE_NAME,
    body: esb
      .requestBodySearch()
      .size(0)
      .suggest(completionSuggester)
      .suggest(fuzzyCompletionSuggester)
      .toJSON()
  };
}

export function createBasicSearchSearches(params) {
  const indexes = getBasicSearchIndexesForEntity(params);
  const searchers = [];

  indexes.forEach(index => {
    searchers.push({ index, type: DOC_TYPE_NAME });
    searchers.push(createBasicSearchQueryForEntity(params));
  });

  return searchers;
}

function getBasicSearchIndexesForEntity(params) {
  switch (params.entityType) {
    case entityType.TALENT:
      return [searchIndexType.TALENT_FULL];
    case entityType.VENUE:
      return [searchIndexType.VENUE_FULL];
    case entityType.EVENT:
      return [searchIndexType.EVENT_FULL];
    case entityType.EVENT_SERIES:
      return [searchIndexType.EVENT_SERIES_FULL];
    case entityType.ALL:
      return [
        searchIndexType.TALENT_FULL,
        searchIndexType.VENUE_FULL,
        searchIndexType.EVENT_SERIES_FULL,
        searchIndexType.EVENT_FULL
      ];
    default:
      throw new Error(`entityType value out of range: ${params.entityType}`);
  }
}

function createBasicSearchQueryForEntity(params) {
  const body = esb
    .requestBodySearch()
    .size(params.take)
    .from(params.skip);

  const query = esb.boolQuery();

  if (params.isPublic) {
    query.filter(esb.termQuery("status", "Active"));
  }

  switch (params.entityType) {
    case entityType.EVENT:
      {
        if (params.term) {
          query
            .should([
              esb.matchQuery("name", params.term),
              esb.matchQuery("venueName", params.term),
              esb.matchQuery("summary", params.term)
            ])
            .minimumShouldMatch(1);
        }

        body
          .source(constants.SUMMARY_EVENT_SOURCE_FIELDS)
          .sorts([esb.sort("_score", "desc"), esb.sort("name_sort")]);
      }
      break;
    case entityType.EVENT_SERIES:
      {
        if (params.term) {
          query.must(esb.matchQuery("name", params.term));
        }

        body
          .source(constants.SUMMARY_EVENT_SERIES_SOURCE_FIELDS)
          .sorts([esb.sort("_score", "desc"), esb.sort("name_sort")]);
      }
      break;
    case entityType.TALENT:
      {
        if (params.term) {
          query.must(
            esb
              .multiMatchQuery(["firstNames", "lastName"], params.term)
              .type("cross_fields")
          );
        }

        body
          .source(constants.SUMMARY_TALENT_SOURCE_FIELDS)
          .sorts([
            esb.sort("_score", "desc"),
            esb.sort("lastName_sort"),
            esb.sort("firstNames.sort")
          ]);
      }
      break;
    case entityType.VENUE:
      {
        if (params.term) {
          query.must(esb.matchQuery("name", params.term));
        }

        if (params.location) {
          query.filter(
            esb
              .geoBoundingBoxQuery("locationOptimized")
              .topLeft(
                esb
                  .geoPoint()
                  .lat(params.location.north)
                  .lon(params.location.west)
              )
              .bottomRight(
                esb
                  .geoPoint()
                  .lat(params.location.south)
                  .lon(params.location.east)
              )
              .type("indexed")
          );
        }

        body
          .source(constants.SUMMARY_VENUE_SOURCE_FIELDS)
          .sorts([esb.sort("_score", "desc"), esb.sort("name_sort")]);
      }
      break;
    default:
      throw new Error(`entityType value out of range: ${params.entityType}`);
  }

  body.query(query);
  return body.toJSON();
}
