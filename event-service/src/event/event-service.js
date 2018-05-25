"use strict";

const ensure = require("ensure-request").ensure;
const normalise = require("normalise-request");
const dynamodb = require("../external-services/dynamodb");
const populate = require("./populate");
const mappings = require("./mappings");
const normalisers = require("./normalisers");
const constraints = require("./constraints");
const entity = require("../entity/entity");
const sns = require("../external-services/sns");
const identity = require("../entity/id");
const ensureErrorHandler = require("../data/ensure-error-handler");

exports.getEvent = async function(eventId) {
  console.log(
    "GETTING EVENT",
    eventId,
    process.env.SERVERLESS_EVENT_TABLE_NAME
  );

  const dbItem = await entity.get(
    process.env.SERVERLESS_EVENT_TABLE_NAME,
    eventId,
    false
  );

  const referencedEntities = await populate.getReferencedEntities(dbItem);

  const response = mappings.mapDbItemToPublicResponse(
    dbItem,
    referencedEntities
  );

  response.isFullEntity = true;
  return response;
};

exports.getEventForEdit = async function(eventId) {
  const dbItem = await entity.get(
    process.env.SERVERLESS_EVENT_TABLE_NAME,
    eventId,
    true
  );

  const referencedEntities = await populate.getReferencedEntities(dbItem);
  return mappings.mapDbItemToAdminResponse(dbItem, referencedEntities);
};

exports.getEventMulti = async function(eventIds) {
  const response = await dynamodb.batchGet({
    RequestItems: {
      [process.env.SERVERLESS_EVENT_TABLE_NAME]: {
        Keys: eventIds.map(id => ({ id })),
        ProjectionExpression:
          "id, #s, #n, eventType, occurrenceType, " +
          "costType, dateFrom, dateTo, summary, " +
          "performancesOverrides, images, venueId",
        ExpressionAttributeNames: { "#n": "name", "#s": "status" }
      }
    },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });

  const dbItems = response.Responses[process.env.SERVERLESS_EVENT_TABLE_NAME];
  const entities = await populate.getReferencedEntitiesForSearch(dbItems);

  return entities.map(entity =>
    mappings.mapDbItemToPublicSummaryResponse(
      entity.entity,
      entity.referencedEntities
    )
  );
};

exports.createOrUpdateEvent = async function(existingEventId, params) {
  normalise(params, normalisers);
  ensure(params, constraints, ensureErrorHandler);

  const id =
    existingEventId ||
    identity.createEventId(params.venueId, params.dateFrom, params.name);

  const dbItem = mappings.mapRequestToDbItem(id, params);
  const referencedEntities = await populate.getReferencedEntities(dbItem);
  await entity.write(process.env.SERVERLESS_EVENT_TABLE_NAME, dbItem);

  const response = mappings.mapDbItemToAdminResponse(
    dbItem,
    referencedEntities
  );

  await sns.notify(
    { eventId: id },
    { arn: process.env.SERVERLESS_EVENT_UPDATED_TOPIC_ARN }
  );

  return response;
};
