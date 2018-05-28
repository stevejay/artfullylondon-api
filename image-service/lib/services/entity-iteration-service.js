'use strict';


const delay = require('delay');
const log = require('loglevel');
const lambda = require('../external-services/lambda');
const sns = require('../external-services/sns');

exports.startIteration = async function(actionId, topicArn) {
  const iterationData = yield lambda.invoke(
    process.env.SERVERLESS_START_ITERATION_LAMBDA_NAME,
    { actionId }
  );

  yield sns.notify(
    {
      startTimestamp: iterationData.startTimestamp,
      lastId: null,
      retry: 0,
    },
    { arn: topicArn }
  );
});

exports.addIterationError = async function(
  message,
  actionId,
  startTimestamp,
  entityId
) {
  try {
    yield lambda.invoke(
      process.env.SERVERLESS_ADD_ITERATION_ERROR_LAMBDA_NAME,
      {
        actionId,
        startTimestamp,
        entityId: entityId,
        message: message || 'Unknown error',
      }
    );
  } catch (logErr) {
    log.error('Error on logging error', logErr);
  }
});

exports.throttleIteration = async function(startTime, minMs) {
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

exports.invokeNextIteration = async function(
  lastId,
  startTimestamp,
  actionId,
  topicArn
) {
  if (lastId) {
    yield sns.notify(
      {
        startTimestamp,
        lastId,
        retry: 0,
      },
      { arn: topicArn }
    );
  } else {
    yield lambda.invoke(process.env.SERVERLESS_END_ITERATION_LAMBDA_NAME, {
      actionId,
      startTimestamp,
    });
  }
});

// exports.retryCurrentIteration = (
//   lastId,
//   startTimestamp,
//   topicArn,
//   retryCount
// ) =>
//   sns.notify(
//     {
//       startTimestamp,
//       lastId,
//       retry: retryCount + 1,
//     },
//     { arn: topicArn }
//   );
