'use strict';

const co = require('co');
const ensure = require('ensure-request').ensure;
const normalise = require('normalise-request');
const dynamoDbClient = require('dynamodb-doc-client-wrapper');
const populate = require('../event/populate');
const mappings = require('../event/mappings');
const entity = require('../entity/entity');
const sns = require('../external-services/sns');
const identity = require('../entity/id');
const ensureErrorHandler = require('../data/ensure-error-handler');
const normalisers = require('../event/normalisers');
const constraints = require('../event/constraints');

module.exports.getEvent = co.wrap(function*(eventId, isPublicRequest) {
  const dbItem = yield entity.get(
    process.env.SERVERLESS_EVENT_TABLE_NAME,
    eventId,
    !isPublicRequest
  );

  const referencedEntities = yield populate.getReferencedEntities(dbItem);

  const response = mappings.mapDbItemToPublicResponse(
    dbItem,
    referencedEntities
  );

  response.isFullEntity = true;
  return response;
});

module.exports.getEventMulti = co.wrap(function*(eventIds) {
  const response = yield dynamoDbClient.batchGet({
    RequestItems: {
      [process.env.SERVERLESS_EVENT_TABLE_NAME]: {
        Keys: eventIds.map(id => ({ id })),
        ProjectionExpression: 'id, #s, #n, eventType, occurrenceType, ' +
          'costType, dateFrom, dateTo, summary, ' +
          'performancesOverrides, images, venueId',
        ExpressionAttributeNames: { '#n': 'name', '#s': 'status' },
      },
    },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY,
  });

  const dbItems = response.Responses[process.env.SERVERLESS_EVENT_TABLE_NAME];
  const entities = yield populate.getReferencedEntitiesForSearch(dbItems);

  return entities.map(entity =>
    mappings.mapDbItemToPublicSummaryResponse(
      entity.entity,
      entity.referencedEntities
    ));
});

module.exports.getEventForEdit = co.wrap(function*(eventId) {
  const dbItem = yield entity.get(
    process.env.SERVERLESS_EVENT_TABLE_NAME,
    eventId,
    true
  );

  const referencedEntities = yield populate.getReferencedEntities(dbItem);
  return mappings.mapDbItemToAdminResponse(dbItem, referencedEntities);
});

module.exports.createOrUpdateEvent = co.wrap(
  function*(existingEventId, params) {
    normalise(params, normalisers);
    ensure(params, constraints, ensureErrorHandler);

    const id = existingEventId ||
      identity.createEventId(params.venueId, params.dateFrom, params.name);

    const dbItem = mappings.mapRequestToDbItem(id, params);
    const referencedEntities = yield populate.getReferencedEntities(dbItem);
    yield entity.write(process.env.SERVERLESS_EVENT_TABLE_NAME, dbItem);

    const response = mappings.mapDbItemToAdminResponse(
      dbItem,
      referencedEntities
    );

    yield sns.notify(id, {
      arn: process.env.SERVERLESS_EVENT_UPDATED_TOPIC_ARN,
    });

    return response;
  }
);
