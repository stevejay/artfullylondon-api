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
const etag = require("../lambda/etag");

exports.getTalent = async function(talentId) {
  const dbItem = await entity.get(
    process.env.SERVERLESS_TALENT_TABLE_NAME,
    talentId,
    false
  );

  const response = mappings.mapDbItemToPublicResponse(dbItem);
  response.isFullEntity = true;
  return response;
};

exports.getTalentMulti = async function(talentIds) {
  const response = await dynamodb.batchGet({
    RequestItems: {
      [process.env.SERVERLESS_TALENT_TABLE_NAME]: {
        Keys: talentIds.map(id => ({ id })),
        ProjectionExpression: constants.SUMMARY_TALENT_PROJECTION_EXPRESSION,
        ExpressionAttributeNames: constants.SUMMARY_TALENT_PROJECTION_NAMES
      }
    },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });

  const dbItems = response.Responses[process.env.SERVERLESS_TALENT_TABLE_NAME];
  return dbItems.map(mappings.mapDbItemToPublicSummaryResponse);
};

exports.getTalentForEdit = async function(talentId) {
  const dbItem = await entity.get(
    process.env.SERVERLESS_TALENT_TABLE_NAME,
    talentId,
    true
  );

  return mappings.mapDbItemToAdminResponse(dbItem);
};

exports.createOrUpdateTalent = async function(existingTalentId, params) {
  normalise(params, normalisers);
  ensure(params, constraints, ensureErrorHandler);

  const id = existingTalentId || identity.createIdFromTalentData(params);

  const description = await wikipedia.getDescription(
    params.description,
    params.descriptionCredit,
    params.links
  );

  const dbItem = mappings.mapRequestToDbItem(id, params, description);
  await entity.write(process.env.SERVERLESS_TALENT_TABLE_NAME, dbItem);
  const adminResponse = mappings.mapDbItemToAdminResponse(dbItem);

  const builder = new EntityBulkUpdateBuilder()
    .addFullSearchUpdate(
      mappings.mapDbItemToFullSearchIndex(dbItem),
      globalConstants.SEARCH_INDEX_TYPE_TALENT_FULL
    )
    .addAutocompleteSearchUpdate(
      mappings.mapDbItemToAutocompleteSearchIndex(dbItem),
      globalConstants.SEARCH_INDEX_TYPE_TALENT_AUTO
    );

  await elasticsearch.bulk({ body: builder.build() });
  const publicResponse = mappings.mapDbItemToPublicResponse(dbItem);

  await etag.writeETagToRedis(
    "talent/" + id,
    JSON.stringify({ entity: publicResponse })
  );

  return adminResponse;
};
