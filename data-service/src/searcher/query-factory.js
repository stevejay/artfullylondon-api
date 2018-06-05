import esb from "elastic-builder/src";
import format from "date-fns/format";

const EVENT_FULL_INDEX_NAME = "event-full";
const DOC_TYPE_NAME = "doc";

export function createSitemapEventIdsQuery(dateTo) {
  return {
    index: EVENT_FULL_INDEX_NAME,
    type: DOC_TYPE_NAME,
    body: esb
      .requestBodySearch()
      .query(
        esb
          .boolQuery()
          .filter(esb.termQuery("status", "Active"))
          .should([
            esb.termQuery("occurrenceType", "Continuous"),
            esb.rangeQuery("dateTo").gte(format(dateTo, "YYYY/MM/DD"))
          ])
          .minimumShouldMatch(1)
      )
      .from(0)
      .size(5000)
      .source("id")
      .toJSON()
  };
}
