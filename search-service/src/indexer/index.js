import BulkUpdateBuilder from "./bulk-update-builder";
import * as mapper from "./mapper";
import * as esClient from "../elasticsearch-client";
import * as searchIndexType from "../search-index-type";
import * as entityType from "../entity-type";

export async function index(request) {
  const builder = new BulkUpdateBuilder();

  switch (request.entityType) {
    case entityType.TALENT:
      builder
        .addFullSearchUpdate(
          mapper.mapTalentForTalentIndex(request.entity),
          searchIndexType.TALENT
        )
        .addAutocompleteSearchUpdate(
          mapper.mapTalentForAutocompleteIndex(request.entity),
          searchIndexType.AUTOCOMPLETE
        );
      break;
    default:
      throw new Error(`Unsupported entity type ${request.entityType}`);
  }

  await esClient.bulk({ body: builder.build() });
}
