import BulkUpdateBuilder from "./bulk-update-builder";
import * as mapper from "./mapper";
import * as esClient from "../searcher/elasticsearch-client";
import * as searchIndexType from "../types/search-index-type";
import * as entityType from "../types/entity-type";
import * as validator from "./validator";

export async function index(request) {
  const builder = new BulkUpdateBuilder();

  switch (request.entityType) {
    case entityType.TALENT:
      validator.validateTalent(request.entity);
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
      validator.validateVenue(request.entity);
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
      validator.validateEventSeries(request.entity);
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
      validator.validateEvent(request.entity);
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
