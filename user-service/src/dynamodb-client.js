"use strict";

const dynamodb = require("serverless-dynamodb-client");

const dynamodbClient = require("dynamodb-doc-client-wrapper")({
  documentClient: dynamodb.doc
});

module.exports = dynamodbClient;
