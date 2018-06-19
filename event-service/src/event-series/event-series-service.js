"use strict";

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
const dynamodb = require("../external-services/dynamodb");
const eventMessaging = require("../event/messaging");
const etag = require("../lambda/etag");
const sns = require("../external-services/sns");

exports.getEventSeries = async function(params) {
  const dbItem = await entity.get(
    process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME,
    params.id,
    false
  );

  const response = mappings.mapDbItemToPublicResponse(dbItem);
  response.isFullEntity = true;
  return { entity: response };
};

exports.getEventSeriesForEdit = async function(params) {
  const dbItem = await entity.get(
    process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME,
    params.id,
    true
  );

  return { entity: mappings.mapDbItemToAdminResponse(dbItem) };
};

exports.getEventSeriesMulti = async function(params) {
  const response = await dynamodb.batchGet({
    RequestItems: {
      [process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME]: {
        Keys: params.ids.map(id => ({ id })),
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

  return { entities: dbItems.map(mappings.mapDbItemToPublicSummaryResponse) };
};

exports.createOrUpdateEventSeries = async function(params) {
  normalise(params, normalisers);
  ensure(params, constraints, ensureErrorHandler);

  const id = params.id || identity.createIdFromName(params.name);
  const isUpdate = !!params.id;

  const dbItem = mappings.mapRequestToDbItem(id, params);
  await entity.write(process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME, dbItem);
  const adminResponse = mappings.mapDbItemToAdminResponse(dbItem);

  if (isUpdate) {
    await eventMessaging.notifyEventsForEventSeries(dbItem.id);
  }

  await sns.notify(
    { entityType: globalConstants.ENTITY_TYPE_EVENT_SERIES, entity: dbItem },
    { arn: process.env.SERVERLESS_INDEX_DOCUMENT_TOPIC_ARN }
  );

  const publicResponse = mappings.mapDbItemToPublicResponse(dbItem);

  await etag.writeETagToRedis(
    "event-series/" + id,
    JSON.stringify({ entity: publicResponse })
  );

  return { entity: adminResponse };
};
