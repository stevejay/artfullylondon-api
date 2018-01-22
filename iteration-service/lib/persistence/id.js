'use strict';

module.exports.createErrorKey = (actionId, startTimestamp) =>
  `${actionId}_${startTimestamp}`;
