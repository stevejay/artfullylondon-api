'use strict';

const generatorHandler = require('../../lib/lambda/generator-handler');
const writeAuthorized = require('../../lib/lambda/lambda-write-authorized-decorator');
const eventSeriesService = require('../../lib/services/event-series-service');

function* handler(event) {
  const request = JSON.parse(event.body);
  const pathId = event.pathParameters && event.pathParameters.id;

  const entity = yield eventSeriesService.createOrUpdateEventSeries(
    pathId,
    request
  );

  return { entity };
}

module.exports.handler = writeAuthorized(generatorHandler(handler));
