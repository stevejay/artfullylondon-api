export function mapIdsQueryResponse(response) {
  return response.hits.hits.map(hit => hit._source.id);
}
