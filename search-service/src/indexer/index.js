import BulkUpdateBuilder from "./bulk-update-builder";
import * as mapper from "./mapper";
import * as esClient from "../searcher/elasticsearch-client";
import * as searchIndexType from "../types/search-index-type";
import * as entityType from "../types/entity-type";
import * as validator from "./validator";

export async function index(request) {
  validator.validateIndexDocumentRequest(request);
  const builder = new BulkUpdateBuilder();
  let documents = null;

  switch (request.entityType) {
    case entityType.TALENT:
      validator.validateTalent(request.entity);
      documents = {
        entity: mapper.mapTalentForEntityIndex(request.entity),
        autocomplete: mapper.mapTalentForAutocompleteIndex(request.entity)
      };
      break;
    case entityType.VENUE:
      validator.validateVenue(request.entity);
      documents = {
        entity: mapper.mapVenueForEntityIndex(request.entity),
        autocomplete: mapper.mapVenueForAutocompleteIndex(request.entity)
      };
      break;
    case entityType.EVENT_SERIES:
      validator.validateEventSeries(request.entity);
      documents = {
        entity: mapper.mapEventSeriesForEntityIndex(request.entity),
        autocomplete: mapper.mapEventSeriesForAutocompleteIndex(request.entity)
      };
      break;
    case entityType.EVENT:
      validator.validateEvent(request.entity);
      documents = {
        entity: mapper.mapEventForEntityIndex(request.entity),
        autocomplete: mapper.mapEventForAutocompleteIndex(request.entity)
      };
      break;
    default:
      throw new Error(`Unsupported entity type ${request.entityType}`);
  }

  builder
    .addEntitySearchUpdate(documents.entity, searchIndexType.ENTITY)
    .addAutocompleteSearchUpdate(
      documents.autocomplete,
      searchIndexType.AUTOCOMPLETE
    );

  await esClient.bulk({ body: builder.build() });
}
