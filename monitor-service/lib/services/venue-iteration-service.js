'use strict';

const co = require('co');
const delay = require('delay');
const log = require('loglevel');
const lambda = require('../external-services/lambda');
const constants = require('../constants');
const sns = require('../external-services/sns');

module.exports.startIteration = co.wrap(function*() {
  const iterationData = yield lambda.invoke(
    process.env.SERVERLESS_START_ITERATION_LAMBDA_NAME,
    { actionId: constants.ITERATE_VENUES_ACTION_ID }
  );

  yield sns.notify(
    {
      startTimestamp: iterationData.startTimestamp,
      lastId: null,
      retry: 0,
    },
    {
      arn: process.env.SERVERLESS_ITERATE_VENUES_TOPIC_ARN,
    }
  );
});

module.exports.getNextVenue = co.wrap(function*(lastId) {
  const result = yield lambda.invoke(
    process.env.SERVERLESS_GET_NEXT_VENUE_LAMBDA_NAME,
    { lastId }
  );

  return result ? result.venueId : null;
});

module.exports.addIterationError = co.wrap(function*(
  err,
  venueId,
  startTimestamp
) {
  try {
    log.error('Iteration error:', err.message);

    yield lambda.invoke(
      process.env.SERVERLESS_ADD_ITERATION_ERROR_LAMBDA_NAME,
      {
        actionId: constants.ITERATE_VENUES_ACTION_ID,
        startTimestamp,
        entityId: venueId,
        message: err.message || 'Unknown error',
      }
    );
  } catch (logErr) {
    log.error('Error on logging error', logErr);
  }
});

module.exports.throttleIteration = co.wrap(function*(startTime, minMs) {
  if (minMs > 1000) {
    throw new Error('minMs cannot be greater than 1000');
  }

  const elapsedTime = process.hrtime(startTime);

  if (elapsedTime[0] < 1) {
    const elapsedMs = Math.floor(elapsedTime[1] / 1000000);

    if (elapsedMs < minMs) {
      yield delay(minMs - elapsedMs);
    }
  }
});

module.exports.invokeNextIteration = co.wrap(function*(
  venueId,
  startTimestamp
) {
  if (venueId) {
    yield sns.notify(
      {
        startTimestamp,
        lastId: venueId,
        retry: 0,
      },
      {
        arn: process.env.SERVERLESS_ITERATE_VENUES_TOPIC_ARN,
      }
    );
  } else {
    yield lambda.invoke(process.env.SERVERLESS_END_ITERATION_LAMBDA_NAME, {
      actionId: constants.ITERATE_VENUES_ACTION_ID,
      startTimestamp,
    });
  }
});
