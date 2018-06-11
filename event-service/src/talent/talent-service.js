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
const etag = require("../lambda/etag");
const sns = require("../external-services/sns");

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
  await sns.notify(
    { entityType: globalConstants.ENTITY_TYPE_TALENT, entity: dbItem },
    { arn: process.env.SERVERLESS_INDEX_DOCUMENT_TOPIC_ARN }
  );
  const publicResponse = mappings.mapDbItemToPublicResponse(dbItem);
  const adminResponse = mappings.mapDbItemToAdminResponse(dbItem);
  await etag.writeETagToRedis(
    "talent/" + id,
    JSON.stringify({ entity: publicResponse })
  );
  return adminResponse;
};
