import elasticsearch from "elasticsearch";
import * as queryFactory from "./query-factory";
import * as responseMapper from "./response-mapper";

const esClient = new elasticsearch.Client({
  host: process.env.ELASTICSEARCH_HOST,
  log: "error"
});

export async function getSitemapEventIds(dateTo) {
  const query = queryFactory.createSitemapEventIdsQuery(dateTo);
  const result = await esClient.search(query);
  return responseMapper.mapIdsQueryResponse(result);
}
