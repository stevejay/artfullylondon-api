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
const dynamodb = require("../external-services/dynamodb");
const eventMessaging = require("../event/messaging");
const etag = require("../lambda/etag");
const addressNormaliser = require("./address-normaliser");
normalise.normalisers.address = addressNormaliser;
const sns = require("../external-services/sns");

exports.getVenue = async function(params) {
  const dbItem = await entity.get(
    process.env.SERVERLESS_VENUE_TABLE_NAME,
    params.id,
    false
  );

  const response = mappings.mapDbItemToPublicResponse(dbItem);
  response.isFullEntity = true;
  return { entity: response };
};

exports.getVenueMulti = async function(params) {
  const response = await dynamodb.batchGet({
    RequestItems: {
      [process.env.SERVERLESS_VENUE_TABLE_NAME]: {
        Keys: params.ids.map(id => ({ id })),
        ProjectionExpression: constants.SUMMARY_VENUE_PROJECTION_EXPRESSION,
        ExpressionAttributeNames: constants.SUMMARY_VENUE_PROJECTION_NAMES
      }
    },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });

  const dbItems = response.Responses[process.env.SERVERLESS_VENUE_TABLE_NAME];
  return { entities: dbItems.map(mappings.mapDbItemToPublicSummaryResponse) };
};

exports.getVenueForEdit = async function(params) {
  const dbItem = await entity.get(
    process.env.SERVERLESS_VENUE_TABLE_NAME,
    params.id,
    true
  );

  return { entity: mappings.mapDbItemToAdminResponse(dbItem) };
};

exports.getNextVenue = async function(params) {
  const result = await dynamodb.scanBasic({
    TableName: process.env.SERVERLESS_VENUE_TABLE_NAME,
    ExclusiveStartKey: params.lastId ? { id: params.lastId } : null,
    Limit: 1,
    ProjectionExpression: "id",
    ConsistentRead: false
  });

  return { venueId: result.Items.length ? result.Items[0].id : null };
};

exports.createOrUpdateVenue = async function(params) {
  normalise(params, normalisers);
  ensure(params, constraints, ensureErrorHandler);

  const venue = params.body;
  const id = params.id || identity.createIdFromName(venue.name);
  const isUpdate = !!params.id;

  const description = await wikipedia.getDescription(
    venue.description,
    venue.descriptionCredit,
    venue.links
  );

  const dbItem = mappings.mapRequestToDbItem(id, venue, description);
  await entity.write(process.env.SERVERLESS_VENUE_TABLE_NAME, dbItem);
  const adminResponse = mappings.mapDbItemToAdminResponse(dbItem);

  if (isUpdate) {
    await eventMessaging.notifyEventsForVenue(dbItem.id);
  }

  await sns.notify(
    { entityType: globalConstants.ENTITY_TYPE_VENUE, entity: dbItem },
    { arn: process.env.SERVERLESS_INDEX_DOCUMENT_TOPIC_ARN }
  );

  const publicResponse = mappings.mapDbItemToPublicResponse(dbItem);

  await etag.writeETagToRedis(
    "venue/" + id,
    JSON.stringify({ entity: publicResponse })
  );

  return { entity: adminResponse };
};
