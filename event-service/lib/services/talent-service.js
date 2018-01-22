'use strict';

const co = require('co');
const dynamoDbClient = require('dynamodb-doc-client-wrapper');
const ensure = require('ensure-request').ensure;
const normalise = require('normalise-request');
const ensureErrorHandler = require('../data/ensure-error-handler');
const entity = require('../entity/entity');
const identity = require('../entity/id');
const wikipedia = require('../external-services/wikipedia');
const mappings = require('../talent/mappings');
const constants = require('../talent/constants');
const normalisers = require('../talent/normalisers');
const constraints = require('../talent/constraints');
const globalConstants = require('../constants');
const EntityBulkUpdateBuilder = require('../entity/entity-bulk-update-builder');
const elasticsearch = require('../external-services/elasticsearch');
const etag = require('../lambda/etag');

module.exports.getTalent = co.wrap(function*(talentId, isPublicRequest) {
  const dbItem = yield entity.get(
    process.env.SERVERLESS_TALENT_TABLE_NAME,
    talentId,
    !isPublicRequest
  );

  const response = mappings.mapDbItemToPublicResponse(dbItem);
  response.isFullEntity = true;
  return response;
});

module.exports.getTalentMulti = co.wrap(function*(talentIds) {
  const response = yield dynamoDbClient.batchGet({
    RequestItems: {
      [process.env.SERVERLESS_TALENT_TABLE_NAME]: {
        Keys: talentIds.map(id => ({ id })),
        ProjectionExpression: constants.SUMMARY_TALENT_PROJECTION_EXPRESSION,
        ExpressionAttributeNames: constants.SUMMARY_TALENT_PROJECTION_NAMES,
      },
    },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY,
  });

  const dbItems = response.Responses[process.env.SERVERLESS_TALENT_TABLE_NAME];
  return dbItems.map(mappings.mapDbItemToPublicSummaryResponse);
});

module.exports.getTalentForEdit = co.wrap(function*(talentId) {
  const dbItem = yield entity.get(
    process.env.SERVERLESS_TALENT_TABLE_NAME,
    talentId,
    true
  );

  return mappings.mapDbItemToAdminResponse(dbItem);
});

module.exports.createOrUpdateTalent = co.wrap(
  function*(existingTalentId, params) {
    normalise(params, normalisers);
    ensure(params, constraints, ensureErrorHandler);

    const id = existingTalentId || identity.createIdFromTalentData(params);

    const description = yield wikipedia.getDescription(
      params.description,
      params.descriptionCredit,
      params.links
    );
    const dbItem = mappings.mapRequestToDbItem(id, params, description);
    yield entity.write(process.env.SERVERLESS_TALENT_TABLE_NAME, dbItem);
    const adminResponse = mappings.mapDbItemToAdminResponse(dbItem);

    const fullSearchItem = mappings.mapDbItemToFullSearchIndex(dbItem);
    const autocompleteItem = mappings.mapDbItemToAutocompleteSearchIndex(
      dbItem
    );

    const builder = new EntityBulkUpdateBuilder()
      .addFullSearchUpdate(
        fullSearchItem,
        globalConstants.SEARCH_INDEX_TYPE_TALENT_FULL
      )
      .addAutocompleteSearchUpdate(
        autocompleteItem,
        globalConstants.SEARCH_INDEX_TYPE_TALENT_AUTO
      );

    yield elasticsearch.bulk({ body: builder.build() });

    const publicResponse = mappings.mapDbItemToPublicResponse(dbItem);

    yield etag.writeETagToRedis(
      'talent/' + id,
      JSON.stringify({ entity: publicResponse })
    );

    return adminResponse;
  }
);
