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

exports.getEvent = async function(params) {
  const dbItem = await entity.get(
    process.env.SERVERLESS_EVENT_TABLE_NAME,
    params.id,
    false
  );

  const referencedEntities = await populate.getReferencedEntities(dbItem);

  const response = mappings.mapDbItemToPublicResponse(
    dbItem,
    referencedEntities
  );

  response.isFullEntity = true;
  return { entity: response };
};

exports.getEventForEdit = async function(params) {
  const dbItem = await entity.get(
    process.env.SERVERLESS_EVENT_TABLE_NAME,
    params.id,
    true
  );

  const referencedEntities = await populate.getReferencedEntities(dbItem);
  return {
    entity: mappings.mapDbItemToAdminResponse(dbItem, referencedEntities)
  };
};

exports.getEventMulti = async function(params) {
  const response = await dynamodb.batchGet({
    RequestItems: {
      [process.env.SERVERLESS_EVENT_TABLE_NAME]: {
        Keys: params.ids.map(id => ({ id })),
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

  return {
    entities: entities.map(entity =>
      mappings.mapDbItemToPublicSummaryResponse(
        entity.entity,
        entity.referencedEntities
      )
    )
  };
};

exports.createOrUpdateEvent = async function(params) {
  normalise(params, normalisers);
  ensure(params, constraints, ensureErrorHandler);

  const event = params.body;
  const id =
    params.id ||
    identity.createEventId(event.venueId, event.dateFrom, event.name);

  const dbItem = mappings.mapRequestToDbItem(id, event);
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

  return { entity: response };
};
