import esb from "elastic-builder";
import * as searchIndexType from "../types/search-index-type";
import * as entityType from "../types/entity-type";

export function createAutocompleteSearch(params) {
  const suggest = esb
    .completionSuggester("autocomplete", "nameSuggest")
    .prefix(params.term)
    .size(5);

  const fuzzySuggest = esb
    .completionSuggester("fuzzyAutocomplete", "nameSuggest")
    .prefix(params.term)
    .size(5)
    .fuzzy(true);

  if (params.singleEntitySearch) {
    suggest.contexts("entityType", [params.entityType]);
    fuzzySuggest.contexts("entityType", [params.entityType]);
  }

  return {
    index: searchIndexType.AUTOCOMPLETE,
    type: "doc",
    body: esb
      .requestBodySearch()
      .size(0)
      .suggest(suggest)
      .suggest(fuzzySuggest)
      .toJSON()
  };
}

export function createEntityCountsSearches() {
  const searches = [];

  [
    searchIndexType.EVENT,
    searchIndexType.EVENT_SERIES,
    searchIndexType.TALENT,
    searchIndexType.VENUE
  ].forEach(index => {
    searches.push({ index, type: "doc" });
    searches.push({ query: { match_all: {} }, from: 0, size: 0 });
  });

  return searches;
}

export function createBasicSearchSearches(params) {
  const creationData = getBasicSearchCreationData(params.entityType);
  const searches = [];

  creationData.forEach(datum => {
    searches.push({ index: datum.index, type: "doc" });
    searches.push(datum.builder(params));
  });

  return searches;
}

const BASIC_SEARCH_DATA = {
  [entityType.TALENT]: {
    index: searchIndexType.TALENT,
    builder: createTalentSearch
  },
  [entityType.VENUE]: {
    index: searchIndexType.VENUE,
    builder: createVenueSearch
  },
  [entityType.EVENT_SERIES]: {
    index: searchIndexType.EVENT_SERIES,
    builder: createEventSeriesSearch
  },
  [entityType.EVENT]: {
    index: searchIndexType.EVENT,
    builder: createEventSearch
  }
};

function getBasicSearchCreationData(type) {
  switch (type) {
    case entityType.TALENT:
    case entityType.VENUE:
    case entityType.EVENT:
    case entityType.EVENT_SERIES:
      return [BASIC_SEARCH_DATA[type]];
    case entityType.ALL:
      return [
        BASIC_SEARCH_DATA[entityType.TALENT],
        BASIC_SEARCH_DATA[entityType.VENUE],
        BASIC_SEARCH_DATA[entityType.EVENT_SERIES],
        BASIC_SEARCH_DATA[entityType.EVENT]
      ];
    default:
      throw new Error(`entity type value out of range: ${type}`);
  }
}

function createTalentSearch(params) {
  const query = esb.boolQuery();

  params.hasTerm &&
    query.must(
      esb
        .multiMatchQuery(["firstNames", "lastName"], params.term)
        .type("cross_fields")
    );

  params.isPublic && query.filter(esb.termQuery("status", "Active"));

  return esb
    .requestBodySearch()
    .query(query)
    .size(params.take)
    .from(params.skip)
    .source([
      "entityType",
      "id",
      "status",
      "image",
      "imageCopyright",
      "imageRatio",
      "imageColor",
      "firstNames",
      "lastName",
      "talentType",
      "commonRole"
    ])
    .sorts([
      esb.sort("_score", "desc"),
      esb.sort("lastName_sort"),
      esb.sort("firstNames.sort")
    ])
    .toJSON();
}

function createVenueSearch(params) {
  const query = esb.boolQuery();
  params.hasTerm && query.must(esb.matchQuery("name", params.term));
  params.isPublic && query.filter(esb.termQuery("status", "Active"));

  params.hasLocation &&
    query.filter(
      esb
        .geoBoundingBoxQuery("locationOptimized")
        .topLeft(
          esb
            .geoPoint()
            .lat(params.north)
            .lon(params.west)
        )
        .bottomRight(
          esb
            .geoPoint()
            .lat(params.south)
            .lon(params.east)
        )
        .type("indexed")
    );

  return esb
    .requestBodySearch()
    .query(query)
    .size(params.take)
    .from(params.skip)
    .source([
      "entityType",
      "id",
      "status",
      "image",
      "imageCopyright",
      "imageRatio",
      "imageColor",
      "name",
      "venueType",
      "address",
      "postcode",
      "latitude",
      "longitude"
    ])
    .sorts([esb.sort("_score", "desc"), esb.sort("name_sort")])
    .toJSON();
}

function createEventSeriesSearch(params) {
  const query = esb.boolQuery();
  params.hasTerm && query.must(esb.matchQuery("name", params.term));
  params.isPublic && query.filter(esb.termQuery("status", "Active"));

  return esb
    .requestBodySearch()
    .query(query)
    .size(params.take)
    .from(params.skip)
    .source([
      "entityType",
      "id",
      "status",
      "image",
      "imageCopyright",
      "imageRatio",
      "imageColor",
      "name",
      "eventSeriesType",
      "occurrence",
      "summary"
    ])
    .sorts([esb.sort("_score", "desc"), esb.sort("name_sort")])
    .toJSON();
}

function createEventSearch(params) {
  const query = esb.boolQuery();

  if (params.hasTerm) {
    query.should(esb.matchQuery("name", params.term));
    query.should(esb.matchQuery("venueName", params.term));
    query.should(esb.matchQuery("summary", params.term));
    query.minimumShouldMatch(1);
  }

  params.isPublic && query.filter(esb.termQuery("status", "Active"));

  return esb
    .requestBodySearch()
    .query(query)
    .size(params.take)
    .from(params.skip)
    .source([
      "entityType",
      "id",
      "status",
      "image",
      "imageCopyright",
      "imageRatio",
      "imageColor",
      "name",
      "eventType",
      "occurrenceType",
      "costType",
      "summary",
      "venueId",
      "venueName",
      "postcode",
      "latitude",
      "longitude",
      "dateFrom",
      "dateTo"
    ])
    .sorts([esb.sort("_score", "desc"), esb.sort("name_sort")])
    .toJSON();
}

export function createEventAdvancedSearch(params) {
  const query = esb.boolQuery();

  if (params.hasTerm) {
    query.should(esb.matchQuery("name", params.term));
    query.should(esb.matchQuery("venueName", params.term));
    query.should(esb.matchQuery("summary", params.term));
    query.minimumShouldMatch(1);
  }

  params.isPublic && query.filter(esb.termQuery("status", "Active"));
  params.hasArea && query.filter(esb.termQuery("area", params.area));
  params.hasArtsType &&
    query.filter(esb.termQuery("artsType", params.artsType));
  params.hasCostType &&
    query.filter(esb.termQuery("costType", params.costType));
  params.hasBookingType &&
    query.filter(esb.termQuery("bookingType", params.bookingType));
  params.hasVenueId && query.filter(esb.termQuery("venueId", params.venueId));
  params.hasTalentId &&
    query.filter(esb.termQuery("talentId", params.talentId));
  params.hasEventSeriesId &&
    query.filter(esb.termQuery("eventSeriesId", params.eventSeriesId));
  params.hasTags && query.filter(esb.termsQuery("tags", params.tags));

  if (params.hasNestedQuery) {
    const nestedQuery = esb.boolQuery();
    params.hasAudience &&
      nestedQuery.filter(esb.termQuery("dates.tags", params.audience));
    params.hasDateFrom &&
      nestedQuery.filter(esb.rangeQuery("dates.date").gte(params.dateFrom));
    params.hasDateTo &&
      nestedQuery.filter(esb.rangeQuery("dates.date").lte(params.dateTo));
    params.hasTimeFrom &&
      nestedQuery.filter(esb.rangeQuery("dates.to").gt(params.timeFrom));
    params.hasTimeTo &&
      nestedQuery.filter(esb.rangeQuery("dates.from").lte(params.timeTo));

    query.filter(
      esb
        .nestedQuery()
        .path("dates")
        .query(nestedQuery)
    );
  }

  params.hasLocation &&
    query.filter(
      esb
        .geoBoundingBoxQuery("locationOptimized")
        .topLeft(
          esb
            .geoPoint()
            .lat(params.north)
            .lon(params.west)
        )
        .bottomRight(
          esb
            .geoPoint()
            .lat(params.south)
            .lon(params.east)
        )
        .type("indexed")
    );

  const source = [
    "entityType",
    "id",
    "status",
    "image",
    "imageCopyright",
    "imageRatio",
    "imageColor",
    "name",
    "eventType",
    "occurrenceType",
    "costType",
    "summary",
    "venueId",
    "venueName",
    "postcode",
    "latitude",
    "longitude",
    "dateFrom",
    "dateTo"
  ];

  params.hasDates && source.push("dates");

  return {
    index: searchIndexType.EVENT,
    type: "doc",
    body: esb
      .requestBodySearch()
      .query(query)
      .size(params.take)
      .from(params.skip)
      .source(source)
      .sorts([esb.sort("_score", "desc"), esb.sort("name_sort")])
      .toJSON()
  };
}

export function createSitemapEventIdsSearch(params) {
  return {
    index: searchIndexType.EVENT,
    type: "doc",
    body: esb
      .requestBodySearch()
      .query(
        esb
          .boolQuery()
          .filter(esb.termQuery("status", "Active"))
          .should(esb.termQuery("occurrenceType", "Continuous"))
          .should(esb.rangeQuery("dateTo").gte(params.dateTo))
          .minimumShouldMatch(1)
      )
      .size(5000)
      .from(0)
      .source(["id"])
      .toJSON()
  };
}

export function createEventsByExternalIdsSearch(params) {
  return {
    index: searchIndexType.EVENT,
    type: "doc",
    body: esb
      .requestBodySearch()
      .query(
        esb.boolQuery().filter(esb.termsQuery("externalEventId", params.ids))
      )
      .size(1000)
      .from(0)
      .source(["id", "externalEventId"])
      .toJSON()
  };
}
