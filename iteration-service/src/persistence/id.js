'use strict';

exports.createErrorKey = (actionId, startTimestamp) =>
  `${actionId}_${startTimestamp}`;
