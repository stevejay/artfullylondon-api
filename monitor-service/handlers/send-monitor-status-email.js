'use strict';

const generatorHandler = require('lambda-generator-handler');
const emailService = require('../lib/services/email-service');

function* handler() {
  yield emailService.sendMonitorStatusEmail();
  return { acknowledged: true };
}

exports.handler = generatorHandler(handler);
