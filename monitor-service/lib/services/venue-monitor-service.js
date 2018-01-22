'use strict';

const co = require('co');
const ensure = require('ensure-request').ensure;
const ensureErrorHandler = require('../validation/ensure-error-handler');
const venueMonitorRepository = require('../persistence/venue-monitor-repository');
const constraints = require('../validation/constraints');
const diff = require('../venue-processing/diff');

module.exports.getVenueMonitor = co.wrap(function*(venueId) {
  const dbItem = yield venueMonitorRepository.get(venueId);
  const changeDiff = yield diff.getDiff(dbItem.oldVenueText, dbItem.venueText);

  if (changeDiff) {
    dbItem.changeDiff = changeDiff;
  }

  delete dbItem.oldVenueText;
  delete dbItem.venueText;

  return dbItem;
});

module.exports.updateVenueMonitor = entity => {
  return new Promise(resolve => {
    ensure(entity, constraints.venueMonitorConstraint, ensureErrorHandler);
    resolve();
  }).then(() => venueMonitorRepository.update(entity));
};

module.exports.save = co.wrap(function*(venueId, venueMonitor) {
  if (!venueMonitor) {
    return;
  }

  const existingVenueMonitor = yield venueMonitorRepository.tryGet(venueId);
  const result = {};

  if (existingVenueMonitor) {
    if (!existingVenueMonitor.oldVenueText) {
      if (existingVenueMonitor.venueText !== venueMonitor.venueText) {
        result.oldVenueText = existingVenueMonitor.venueText;
        result.hasChanged = true;
      } else {
        result.hasChanged = false;
      }
    } else {
      if (existingVenueMonitor.oldVenueText === venueMonitor.venueText) {
        result.hasChanged = false;
      } else {
        result.oldVenueText = existingVenueMonitor.oldVenueText;
        result.hasChanged = true;
      }
    }

    result.isIgnored = existingVenueMonitor.isIgnored;
  } else {
    result.isIgnored = false;
    result.hasChanged = false;
  }

  result.venueText = venueMonitor.venueText;
  result.venueId = venueId;

  yield venueMonitorRepository.put(result);
});
