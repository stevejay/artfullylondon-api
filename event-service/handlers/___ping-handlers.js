// 'use strict';

// require('aws-sdk');
// const lambda = require('aws-lambda-invoke');
// const generatorHandler = require('lambda-generator-handler');

// const LAMBDAS_TO_PING = [
//     'event-service-production-createOrUpdateEvent',
//     'event-service-production-createOrUpdateEventSeries',
//     'event-service-production-createOrUpdateTalent',
//     'event-service-production-createOrUpdateVenue',
//     'event-service-production-getEvent',
//     'event-service-production-getEventSeries',
//     'event-service-production-getTalent',
//     'event-service-production-getVenue'
// ];

// function* handler() {
//     const payload = { query: { ping: true } };
//     yield LAMBDAS_TO_PING.map(lambdaName => lambda.invoke(lambdaName, payload));
// }

// module.exports.handler = generatorHandler(handler);
