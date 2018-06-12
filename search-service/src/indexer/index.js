import BulkUpdateBuilder from "./bulk-update-builder";
import * as mapper from "./mapper";
import * as esClient from "../elasticsearch-client";
import * as searchIndexType from "../types/search-index-type";
import * as entityType from "../types/entity-type";

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
    case entityType.VENUE:
      builder
        .addFullSearchUpdate(
          mapper.mapVenueForVenueIndex(request.entity),
          searchIndexType.VENUE
        )
        .addAutocompleteSearchUpdate(
          mapper.mapVenueForAutocompleteIndex(request.entity),
          searchIndexType.AUTOCOMPLETE
        );
      break;
    case entityType.EVENT_SERIES:
      builder
        .addFullSearchUpdate(
          mapper.mapEventSeriesForEventSeriesIndex(request.entity),
          searchIndexType.EVENT_SERIES
        )
        .addAutocompleteSearchUpdate(
          mapper.mapEventSeriesForAutocompleteIndex(request.entity),
          searchIndexType.AUTOCOMPLETE
        );
      break;
    case entityType.EVENT:
      builder
        .addFullSearchUpdate(
          mapper.mapEventForEventIndex(request.entity),
          searchIndexType.EVENT
        )
        .addAutocompleteSearchUpdate(
          mapper.mapEventForAutocompleteIndex(request.entity),
          searchIndexType.AUTOCOMPLETE
        );
      break;
    default:
      throw new Error(`Unsupported entity type ${request.entityType}`);
  }

  await esClient.bulk({ body: builder.build() });
}
