'use strict';

const dynamoDbClient = require('dynamodb-doc-client-wrapper');

module.exports.get = venueId =>
  dynamoDbClient.get({
    TableName: process.env.SERVERLESS_VENUE_MONITOR_TABLE_NAME,
    Key: { venueId },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY,
  });

module.exports.tryGet = venueId =>
  dynamoDbClient.tryGet({
    TableName: process.env.SERVERLESS_VENUE_MONITOR_TABLE_NAME,
    Key: { venueId },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY,
  });

module.exports.update = entity =>
  dynamoDbClient.update({
    TableName: process.env.SERVERLESS_VENUE_MONITOR_TABLE_NAME,
    Key: { venueId: entity.venueId },
    UpdateExpression: 'set isIgnored = :isIgnored, hasChanged = :hasChanged',
    ConditionExpression: 'attribute_exists(venueId)',
    ExpressionAttributeValues: {
      ':isIgnored': entity.isIgnored,
      ':hasChanged': entity.hasChanged,
    },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY,
  });

module.exports.put = entity =>
  dynamoDbClient.put({
    TableName: process.env.SERVERLESS_VENUE_MONITOR_TABLE_NAME,
    Item: entity,
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY,
  });

module.exports.getChanged = () =>
  dynamoDbClient.scan({
    TableName: process.env.SERVERLESS_VENUE_MONITOR_TABLE_NAME,
    FilterExpression: 'isIgnored = :isIgnored AND hasChanged = :hasChanged',
    ExpressionAttributeValues: {
      ':isIgnored': false,
      ':hasChanged': true,
    },
    ProjectionExpression: 'venueId',
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY,
  });
