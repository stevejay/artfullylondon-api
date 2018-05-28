"use strict";

const delay = require("delay");
const log = require("loglevel");
const lambda = require("../external-services/lambda");
const constants = require("../constants");
const sns = require("../external-services/sns");

exports.startIteration = async function() {
  const iterationData = await lambda.invoke(
    process.env.SERVERLESS_START_ITERATION_LAMBDA_NAME,
    { actionId: constants.ITERATE_VENUES_ACTION_ID }
  );

  await sns.notify(
    {
      startTimestamp: iterationData.startTimestamp,
      lastId: null,
      retry: 0
    },
    {
      arn: process.env.SERVERLESS_ITERATE_VENUES_TOPIC_ARN
    }
  );
};

exports.getNextVenue = async function(lastId) {
  const result = await lambda.invoke(
    process.env.SERVERLESS_GET_NEXT_VENUE_LAMBDA_NAME,
    { lastId }
  );

  return result ? result.venueId : null;
};

exports.addIterationError = async function(err, venueId, startTimestamp) {
  try {
    log.error("Iteration error:", err.message);

    await lambda.invoke(
      process.env.SERVERLESS_ADD_ITERATION_ERROR_LAMBDA_NAME,
      {
        actionId: constants.ITERATE_VENUES_ACTION_ID,
        startTimestamp,
        entityId: venueId,
        message: err.message || "Unknown error"
      }
    );
  } catch (logErr) {
    log.error("Error on logging error", logErr);
  }
};

exports.throttleIteration = async function(startTime, minMs) {
  if (minMs > 1000) {
    throw new Error("minMs cannot be greater than 1000");
  }

  const elapsedTime = process.hrtime(startTime);

  if (elapsedTime[0] < 1) {
    const elapsedMs = Math.floor(elapsedTime[1] / 1000000);

    if (elapsedMs < minMs) {
      await delay(minMs - elapsedMs);
    }
  }
};

exports.invokeNextIteration = async function(venueId, startTimestamp) {
  if (venueId) {
    await sns.notify(
      {
        startTimestamp,
        lastId: venueId,
        retry: 0
      },
      {
        arn: process.env.SERVERLESS_ITERATE_VENUES_TOPIC_ARN
      }
    );
  } else {
    await lambda.invoke(process.env.SERVERLESS_END_ITERATION_LAMBDA_NAME, {
      actionId: constants.ITERATE_VENUES_ACTION_ID,
      startTimestamp
    });
  }
};
