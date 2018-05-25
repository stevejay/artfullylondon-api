"use strict";

const ensure = require("ensure-request").ensure;
const normalise = require("normalise-request");
const ensureErrorHandler = require("../data/ensure-error-handler");
const entity = require("../entity/entity");
const identity = require("../entity/id");
const wikipedia = require("../external-services/wikipedia");
const mappings = require("./mappings");
const constants = require("./constants");
const normalisers = require("./normalisers");
const constraints = require("./constraints");
const globalConstants = require("../constants");
const EntityBulkUpdateBuilder = require("../entity/entity-bulk-update-builder");
const elasticsearch = require("../external-services/elasticsearch");
const dynamodb = require("../external-services/dynamodb");
const eventMessaging = require("../event/messaging");
const etag = require("../lambda/etag");
const addressNormaliser = require("./address-normaliser");
normalise.normalisers.address = addressNormaliser;

exports.getVenue = async function(venueId) {
  const dbItem = await entity.get(
    process.env.SERVERLESS_VENUE_TABLE_NAME,
    venueId,
    false
  );

  const response = mappings.mapDbItemToPublicResponse(dbItem);
  response.isFullEntity = true;
  return response;
};

exports.getVenueMulti = async function(venueIds) {
  const response = await dynamodb.batchGet({
    RequestItems: {
      [process.env.SERVERLESS_VENUE_TABLE_NAME]: {
        Keys: venueIds.map(id => ({ id })),
        ProjectionExpression: constants.SUMMARY_VENUE_PROJECTION_EXPRESSION,
        ExpressionAttributeNames: constants.SUMMARY_VENUE_PROJECTION_NAMES
      }
    },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });

  const dbItems = response.Responses[process.env.SERVERLESS_VENUE_TABLE_NAME];
  return dbItems.map(mappings.mapDbItemToPublicSummaryResponse);
};

exports.getVenueForEdit = async function(venueId) {
  const dbItem = await entity.get(
    process.env.SERVERLESS_VENUE_TABLE_NAME,
    venueId,
    true
  );

  return mappings.mapDbItemToAdminResponse(dbItem);
};

exports.getNextVenue = async function(previousVenueId) {
  return await dynamodb.scanBasic({
    TableName: process.env.SERVERLESS_VENUE_TABLE_NAME,
    ExclusiveStartKey: previousVenueId ? { id: previousVenueId } : null,
    Limit: 1,
    ProjectionExpression: "id",
    ConsistentRead: false
  });
};

exports.createOrUpdateVenue = async function(existingVenueId, params) {
  normalise(params, normalisers);
  ensure(params, constraints, ensureErrorHandler);

  const id = existingVenueId || identity.createIdFromName(params.name);
  const isUpdate = !!existingVenueId;

  const description = await wikipedia.getDescription(
    params.description,
    params.descriptionCredit,
    params.links
  );

  const dbItem = mappings.mapRequestToDbItem(id, params, description);
  await entity.write(process.env.SERVERLESS_VENUE_TABLE_NAME, dbItem);
  const adminResponse = mappings.mapDbItemToAdminResponse(dbItem);

  if (isUpdate) {
    await eventMessaging.notifyEventsForVenue(dbItem.id);
  }

  const fullSearchItem = mappings.mapDbItemToFullSearchIndex(dbItem);
  const autocompleteItem = mappings.mapDbItemToAutocompleteSearchIndex(dbItem);

  const builder = new EntityBulkUpdateBuilder()
    .addFullSearchUpdate(
      fullSearchItem,
      globalConstants.SEARCH_INDEX_TYPE_VENUE_FULL
    )
    .addAutocompleteSearchUpdate(
      autocompleteItem,
      globalConstants.SEARCH_INDEX_TYPE_VENUE_AUTO
    );

  await elasticsearch.bulk({ body: builder.build() });
  const publicResponse = mappings.mapDbItemToPublicResponse(dbItem);

  await etag.writeETagToRedis(
    "venue/" + id,
    JSON.stringify({ entity: publicResponse })
  );

  return adminResponse;
};
