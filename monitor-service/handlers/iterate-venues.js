'use strict';

const generatorHandler = require('lambda-generator-handler');
const service = require('../lib/services/venue-iteration-service');

function* handler() {
  yield service.startIteration();
  return { acknowledged: true };
}

exports.handler = generatorHandler(handler);
