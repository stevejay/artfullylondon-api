import _ from "lodash";
import esb from "elastic-builder";
import * as searchIndexType from "../types/search-index-type";
import * as entityType from "../types/entity-type";
import * as statusType from "../types/status-type";
import * as occurrenceType from "../types/occurrence-type";

export function createAutocompleteSearch(params) {
  const body = esb.requestBodySearch().size(0);

  if (params.entityType) {
    body.suggest(createSuggestSearch(params.entityType, params.term, false, 5));
    body.suggest(createSuggestSearch(params.entityType, params.term, true, 5));
  } else {
    entityType.ALLOWED_VALUES.forEach(type => {
      body.suggest(createSuggestSearch(type, params.term, false, 3));
      body.suggest(createSuggestSearch(type, params.term, true, 3));
    });
  }

  return {
    index: searchIndexType.AUTOCOMPLETE,
    type: "doc",
    body: body.toJSON()
  };
}

function createSuggestSearch(entityType, term, fuzzy, size) {
  return esb
    .completionSuggester(`${entityType}${fuzzy ? "_fuzzy" : ""}`, "nameSuggest")
    .prefix(term)
    .size(size)
    .fuzzy(fuzzy)
    .contexts("entityType", [entityType]);
}

export function createEntityCountSearch() {
  const body = esb.requestBodySearch().size(0);

  entityType.ALLOWED_VALUES.forEach(type => {
    body.agg(esb.filterAggregation(type, esb.termQuery("entityType", type)));
  });

  return {
    index: searchIndexType.ENTITY,
    type: "doc",
    body: body.toJSON()
  };
}

export function createBasicSearch(params) {
  const query = esb.boolQuery();

  params.status && query.filter(esb.termQuery("status", params.status));

  params.entityType &&
    query.filter(esb.termQuery("entityType", params.entityType));

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

  if (params.term) {
    const nameQuery = esb
      .boolQuery()
      .minimumShouldMatch(1)
      .should(
        esb
          .multiMatchQuery(["firstNames", "lastName"], params.term)
          .type("cross_fields")
      )
      .should(esb.matchQuery("name", params.term))
      .should(esb.matchQuery("venueName", params.term));

    // TODO consider if summary should also be searched for term.

    query.must(nameQuery);
  }

  const body = esb
    .requestBodySearch()
    .query(query)
    .size(params.first)
    .source([
      "entityType",
      "id",
      "status",
      "image",
      "imageCopyright",
      "imageRatio",
      "imageColor",
      "name",
      "firstNames",
      "lastName",
      "talentType",
      "commonRole",
      "venueType",
      "address",
      "postcode",
      "latitude",
      "longitude",
      "eventSeriesType",
      "occurrence",
      "summary",
      "eventType",
      "occurrenceType",
      "costType",
      "venueId",
      "venueName",
      "dateFrom",
      "dateTo"
    ])
    .sorts([
      esb.sort("_score", "desc"),
      esb.sort("lastName_sort"),
      esb.sort("firstNames.sort"),
      esb.sort("name_sort"),
      esb.sort("id")
    ]);

  if (params.after) {
    body.searchAfter(params.after);
  }

  return {
    index: searchIndexType.ENTITY,
    type: "doc",
    body: body.toJSON()
  };
}

export function createEventAdvancedSearch(params) {
  const query = esb.boolQuery();
  query.filter(esb.termQuery("entityType", entityType.EVENT));

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
    index: searchIndexType.ENTITY,
    type: "doc",
    body: search.toJSON()
  };
}

export function createSitemapEventSearch(params) {
  return {
    index: searchIndexType.ENTITY,
    type: "doc",
    body: esb
      .requestBodySearch()
      .query(
        esb
          .boolQuery()
          .filter(esb.termQuery("entityType", entityType.EVENT))
          .filter(esb.termQuery("status", statusType.ACTIVE))
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
