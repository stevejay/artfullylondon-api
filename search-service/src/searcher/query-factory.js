import _ from "lodash";
import esb from "elastic-builder";
import * as searchIndexType from "../types/search-index-type";
import * as entityType from "../types/entity-type";
import * as statusType from "../types/status-type";
import * as occurrenceType from "../types/occurrence-type";

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

  if (params.entityType) {
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

export function createEntityCountSearches() {
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
    default:
      return [
        BASIC_SEARCH_DATA[entityType.TALENT],
        BASIC_SEARCH_DATA[entityType.VENUE],
        BASIC_SEARCH_DATA[entityType.EVENT_SERIES],
        BASIC_SEARCH_DATA[entityType.EVENT]
      ];
  }
}

function createTalentSearch(params) {
  const query = esb.boolQuery();

  if (params.term) {
    query.must(
      esb
        .multiMatchQuery(["firstNames", "lastName"], params.term)
        .type("cross_fields")
    );
  }

  params.status && query.filter(esb.termQuery("status", params.status));

  const search = esb
    .requestBodySearch()
    .query(query)
    .size(params.first);

  if (params.after) {
    search.searchAfter(params.after);
  }

  return search
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
      esb.sort("firstNames.sort"),
      esb.sort("id")
    ])
    .toJSON();
}

function createVenueSearch(params) {
  const query = esb.boolQuery();

  if (params.term) {
    query.must(esb.matchQuery("name", params.term));
  }

  params.status && query.filter(esb.termQuery("status", params.status));

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

  const search = esb
    .requestBodySearch()
    .query(query)
    .size(params.first);

  if (params.after) {
    search.searchAfter(params.after);
  }

  return search
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
    .sorts([esb.sort("_score", "desc"), esb.sort("name_sort"), esb.sort("id")])
    .toJSON();
}

function createEventSeriesSearch(params) {
  const query = esb.boolQuery();

  if (params.term) {
    query.must(esb.matchQuery("name", params.term));
  }

  params.status && query.filter(esb.termQuery("status", params.status));

  const search = esb
    .requestBodySearch()
    .query(query)
    .size(params.first);

  if (params.after) {
    search.searchAfter(params.after);
  }

  return search
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
    .sorts([esb.sort("_score", "desc"), esb.sort("name_sort"), esb.sort("id")])
    .toJSON();
}

function createEventSearch(params) {
  const query = esb.boolQuery();

  if (params.term) {
    query.should(esb.matchQuery("name", params.term));
    query.should(esb.matchQuery("venueName", params.term));
    query.should(esb.matchQuery("summary", params.term));
    query.minimumShouldMatch(1);
  }

  params.status && query.filter(esb.termQuery("status", params.status));

  const search = esb
    .requestBodySearch()
    .query(query)
    .size(params.first);

  if (params.after) {
    search.searchAfter(params.after);
  }

  return search
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
    .sorts([esb.sort("_score", "desc"), esb.sort("name_sort"), esb.sort("id")])
    .toJSON();
}

export function createEventAdvancedSearch(params) {
  const query = esb.boolQuery();

  if (params.term) {
    query.should(esb.matchQuery("name", params.term));
    query.should(esb.matchQuery("venueName", params.term));
    query.should(esb.matchQuery("summary", params.term));
    query.minimumShouldMatch(1);
  }

  params.status && query.filter(esb.termQuery("status", params.status));
  params.area && query.filter(esb.termQuery("area", params.area));
  params.artsType && query.filter(esb.termQuery("artsType", params.artsType));
  params.costType && query.filter(esb.termQuery("costType", params.costType));
  params.bookingType &&
    query.filter(esb.termQuery("bookingType", params.bookingType));
  params.venueId && query.filter(esb.termQuery("venueId", params.venueId));
  params.talentId && query.filter(esb.termQuery("talentId", params.talentId));
  params.eventSeriesId &&
    query.filter(esb.termQuery("eventSeriesId", params.eventSeriesId));
  !_.isEmpty(params.tags) && query.filter(esb.termsQuery("tags", params.tags));
  params.externalEventIds &&
    query.filter(esb.termsQuery("externalEventId", params.externalEventIds));

  if (params.hasNestedQuery) {
    const nestedQuery = esb.boolQuery();
    params.audience &&
      nestedQuery.filter(esb.termQuery("dates.tags", params.audience));
    params.dateFrom &&
      nestedQuery.filter(esb.rangeQuery("dates.date").gte(params.dateFrom));
    params.dateTo &&
      nestedQuery.filter(esb.rangeQuery("dates.date").lte(params.dateTo));
    params.timeFrom &&
      nestedQuery.filter(esb.rangeQuery("dates.to").gt(params.timeFrom));
    params.timeTo &&
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

  const search = esb
    .requestBodySearch()
    .query(query)
    .source(source)
    .sorts([esb.sort("_score", "desc"), esb.sort("name_sort"), esb.sort("id")])
    .size(params.first);

  if (params.after) {
    search.searchAfter(params.after);
  }

  return {
    index: searchIndexType.EVENT,
    type: "doc",
    body: search.toJSON()
  };
}

export function createSitemapEventSearch(params) {
  return {
    index: searchIndexType.EVENT,
    type: "doc",
    body: esb
      .requestBodySearch()
      .query(
        esb
          .boolQuery()
          .filter(createPublicFilter())
          .should(esb.termQuery("occurrenceType", occurrenceType.CONTINUOUS))
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

// TODO Remove
function createPublicFilter() {
  return esb.termQuery("status", statusType.ACTIVE);
}
