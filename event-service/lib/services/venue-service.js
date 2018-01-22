'use strict';

const co = require('co');
const dynamoDbClient = require('dynamodb-doc-client-wrapper');
const ensure = require('ensure-request').ensure;
const normalise = require('normalise-request');
const ensureErrorHandler = require('../data/ensure-error-handler');
const entity = require('../entity/entity');
const identity = require('../entity/id');
const wikipedia = require('../external-services/wikipedia');
const mappings = require('../venue/mappings');
const constants = require('../venue/constants');
const normalisers = require('../venue/normalisers');
const constraints = require('../venue/constraints');
const globalConstants = require('../constants');
const EntityBulkUpdateBuilder = require('../entity/entity-bulk-update-builder');
const elasticsearch = require('../external-services/elasticsearch');
const eventMessaging = require('../event/messaging');
const etag = require('../lambda/etag');
const addressNormaliser = require('../../lib/venue/address-normaliser');
normalise.normalisers.address = addressNormaliser;

module.exports.getVenue = co.wrap(function*(venueId, isPublicRequest) {
  const dbItem = yield entity.get(
    process.env.SERVERLESS_VENUE_TABLE_NAME,
    venueId,
    !isPublicRequest
  );

  const response = mappings.mapDbItemToPublicResponse(dbItem);
  response.isFullEntity = true;
  return response;
});

module.exports.getVenueMulti = co.wrap(function*(venueIds) {
  const response = yield dynamoDbClient.batchGet({
    RequestItems: {
      [process.env.SERVERLESS_VENUE_TABLE_NAME]: {
        Keys: venueIds.map(id => ({ id })),
        ProjectionExpression: constants.SUMMARY_VENUE_PROJECTION_EXPRESSION,
        ExpressionAttributeNames: constants.SUMMARY_VENUE_PROJECTION_NAMES,
      },
    },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY,
  });

  const dbItems = response.Responses[process.env.SERVERLESS_VENUE_TABLE_NAME];
  return dbItems.map(mappings.mapDbItemToPublicSummaryResponse);
});

module.exports.getVenueForEdit = co.wrap(function*(venueId) {
  const dbItem = yield entity.get(
    process.env.SERVERLESS_VENUE_TABLE_NAME,
    venueId,
    true
  );

  return mappings.mapDbItemToAdminResponse(dbItem);
});

module.exports.getNextVenue = previousVenueId => {
  return dynamoDbClient.scanBasic({
    TableName: process.env.SERVERLESS_VENUE_TABLE_NAME,
    ExclusiveStartKey: previousVenueId ? { id: previousVenueId } : null,
    Limit: 1,
    ProjectionExpression: 'id',
    ConsistentRead: false,
  });
};

module.exports.createOrUpdateVenue = co.wrap(
  function*(existingVenueId, params) {
    normalise(params, normalisers);
    ensure(params, constraints, ensureErrorHandler);

    const id = existingVenueId || identity.createIdFromName(params.name);
    const isUpdate = !!existingVenueId;

    const description = yield wikipedia.getDescription(
      params.description,
      params.descriptionCredit,
      params.links
    );

    const dbItem = mappings.mapRequestToDbItem(id, params, description);
    yield entity.write(process.env.SERVERLESS_VENUE_TABLE_NAME, dbItem);
    const adminResponse = mappings.mapDbItemToAdminResponse(dbItem);

    if (isUpdate) {
      yield eventMessaging.notifyEventsForVenue(dbItem.id);
    }

    const fullSearchItem = mappings.mapDbItemToFullSearchIndex(dbItem);
    const autocompleteItem = mappings.mapDbItemToAutocompleteSearchIndex(
      dbItem
    );

    const builder = new EntityBulkUpdateBuilder()
      .addFullSearchUpdate(
        fullSearchItem,
        globalConstants.SEARCH_INDEX_TYPE_VENUE_FULL
      )
      .addAutocompleteSearchUpdate(
        autocompleteItem,
        globalConstants.SEARCH_INDEX_TYPE_VENUE_AUTO
      );

    yield elasticsearch.bulk({ body: builder.build() });

    const publicResponse = mappings.mapDbItemToPublicResponse(dbItem);

    yield etag.writeETagToRedis(
      'venue/' + id,
      JSON.stringify({ entity: publicResponse })
    );

    return adminResponse;
  }
);
