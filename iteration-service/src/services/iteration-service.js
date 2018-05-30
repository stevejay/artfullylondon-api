"use strict";

const id = require("../persistence/id");
const iterationErrorRepository = require("../persistence/iteration-error-repository");
const iterationLockRepository = require("../persistence/iteration-lock-repository");
const iterationRepository = require("../persistence/iteration-repository");

exports.startIteration = async function(actionId) {
  const item = { actionId, startTimestamp: Date.now() };
  await iterationLockRepository.addLock(item);
  await iterationRepository.addIteration(item);
  return item;
};

exports.addIterationError = (actionId, startTimestamp, entityId, message) =>
  iterationErrorRepository.saveError({
    actionIdStartTimestamp: id.createErrorKey(actionId, startTimestamp),
    entityId,
    message
  });

exports.endIteration = async function(actionId, startTimestamp) {
  await iterationLockRepository.deleteLock(actionId);
  await iterationRepository.setIterationEndTimestamp(actionId, startTimestamp);
};

exports.getLatestIterationErrors = async function(actionId) {
  // get the most recent run of the action.
  const iterationResponse = await iterationRepository.getMostRecentIteration(
    actionId
  );

  const iteration =
    iterationResponse &&
    iterationResponse.Items &&
    iterationResponse.Items.length &&
    iterationResponse.Items[0];

  let errors = [];

  if (iteration) {
    const key = id.createErrorKey(actionId, iteration.startTimestamp);

    // get any errors for that most recent run.
    const result = await iterationErrorRepository.getErrorsForIteration(key);

    errors = result;
  }

  return errors;
};
