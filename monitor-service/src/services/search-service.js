"use strict";

const MultiSearchBuilder = require("es-search-builder").MultiSearchBuilder;
const elasticsearch = require("../external-services/elasticsearch");

exports.findEvents = async function(externalEventIds) {
  const msearchBuilder = new MultiSearchBuilder();
  const searchSourceFields = ["externalEventId", "id"];

  const search = msearchBuilder
    .createSearch({
      index: constants.SEARCH_INDEX_TYPE_EVENT_FULL,
      type: "doc"
    })
    .setSearchTake(1000)
    .setSearchSource(searchSourceFields);

  const boolQuery = search.createQuery().createBoolQuery();
  const ids = externalEventIds.split(",");
  boolQuery.addFilter().setTerms({ externalEventId: ids });

  const msearches = msearchBuilder.build();
  const results = await msearch.search(msearches);
  const hits = results.responses[0].hits;
  return hits.hits.length ? hits.hits.map(hit => hit._source) : [];
};
