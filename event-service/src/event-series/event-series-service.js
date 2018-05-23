"use strict";

const dynamoDbClient = require("dynamodb-doc-client-wrapper");
const ensure = require("ensure-request").ensure;
const normalise = require("normalise-request");
const ensureErrorHandler = require("../data/ensure-error-handler");
const entity = require("../entity/entity");
const identity = require("../entity/id");
const globalConstants = require("../constants");
const mappings = require("./mappings");
const constants = require("./constants");
const normalisers = require("./normalisers");
const constraints = require("./constraints");
const EntityBulkUpdateBuilder = require("../entity/entity-bulk-update-builder");
const elasticsearch = require("../external-services/elasticsearch");
const eventMessaging = require("../event/messaging");
const etag = require("../lambda/etag");

exports.getEventSeries = co.wrap(function*(eventSeriesId) {
  const dbItem = yield entity.get(
    process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME,
    eventSeriesId,
    false
  );

  const response = mappings.mapDbItemToPublicResponse(dbItem);

  response.isFullEntity = true;
  return response;
});

exports.getEventSeriesMulti = co.wrap(function*(eventSeriesIds) {
  const response = yield dynamoDbClient.batchGet({
    RequestItems: {
      [process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME]: {
        Keys: eventSeriesIds.map(id => ({ id })),
        ProjectionExpression:
          constants.SUMMARY_EVENT_SERIES_PROJECTION_EXPRESSION,
        ExpressionAttributeNames:
          constants.SUMMARY_EVENT_SERIES_PROJECTION_NAMES
      }
    },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });

  const dbItems =
    response.Responses[process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME];

  return dbItems.map(mappings.mapDbItemToPublicSummaryResponse);
});

exports.getEventSeriesForEdit = co.wrap(function*(eventSeriesId) {
  const dbItem = yield entity.get(
    process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME,
    eventSeriesId,
    true
  );

  return mappings.mapDbItemToAdminResponse(dbItem);
});

exports.createOrUpdateEventSeries = co.wrap(function*(
  existingEventSeriesId,
  params
) {
  normalise(params, normalisers);
  ensure(params, constraints, ensureErrorHandler);

  const id = existingEventSeriesId || identity.createIdFromName(params.name);
  const isUpdate = !!existingEventSeriesId;

  const dbItem = mappings.mapRequestToDbItem(id, params);
  yield entity.write(process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME, dbItem);
  const adminResponse = mappings.mapDbItemToAdminResponse(dbItem);

  if (isUpdate) {
    yield eventMessaging.notifyEventsForEventSeries(dbItem.id);
  }

  const fullSearchItem = mappings.mapDbItemToFullSearchIndex(dbItem);

  const autocompleteItem = mappings.mapDbItemToAutocompleteSearchIndex(dbItem);

  const builder = new EntityBulkUpdateBuilder()
    .addFullSearchUpdate(
      fullSearchItem,
      globalConstants.SEARCH_INDEX_TYPE_EVENT_SERIES_FULL
    )
    .addAutocompleteSearchUpdate(
      autocompleteItem,
      globalConstants.SEARCH_INDEX_TYPE_EVENT_SERIES_AUTO
    )
    .addAutocompleteSearchUpdate(
      autocompleteItem,
      globalConstants.SEARCH_INDEX_TYPE_COMBINED_EVENT_AUTO
    );

  yield elasticsearch.bulk({ body: builder.build() });

  const publicResponse = mappings.mapDbItemToPublicResponse(dbItem);

  yield etag.writeETagToRedis(
    "event-series/" + id,
    JSON.stringify({ entity: publicResponse })
  );

  return adminResponse;
});
