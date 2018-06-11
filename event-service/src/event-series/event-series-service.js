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

exports.getEventSeries = async function(eventSeriesId) {
  const dbItem = await entity.get(
    process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME,
    eventSeriesId,
    false
  );

  const response = mappings.mapDbItemToPublicResponse(dbItem);

  response.isFullEntity = true;
  return response;
};

exports.getEventSeriesForEdit = async function(eventSeriesId) {
  const dbItem = await entity.get(
    process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME,
    eventSeriesId,
    true
  );

  return mappings.mapDbItemToAdminResponse(dbItem);
};

exports.getEventSeriesMulti = async function(eventSeriesIds) {
  const response = await dynamodb.batchGet({
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
};

exports.createOrUpdateEventSeries = async function(
  existingEventSeriesId,
  params
) {
  normalise(params, normalisers);
  ensure(params, constraints, ensureErrorHandler);

  const id = existingEventSeriesId || identity.createIdFromName(params.name);
  const isUpdate = !!existingEventSeriesId;

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

  return adminResponse;
};
