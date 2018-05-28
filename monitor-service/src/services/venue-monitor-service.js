"use strict";

const ensure = require("ensure-request").ensure;
const ensureErrorHandler = require("../validation/ensure-error-handler");
const venueMonitorRepository = require("../persistence/venue-monitor-repository");
const constraints = require("../validation/constraints");
const diff = require("../venue-processing/diff");

exports.getVenueMonitors = async function(venueId) {
  const dbItem = await venueMonitorRepository.tryGet(venueId);
  if (!dbItem) {
    return [];
  }

  const changeDiff = await diff.getDiff(dbItem.oldVenueText, dbItem.venueText);

  if (changeDiff) {
    dbItem.changeDiff = changeDiff;
  }

  delete dbItem.oldVenueText;
  delete dbItem.venueText;

  return [dbItem];
};

exports.updateVenueMonitor = async entity => {
  ensure(entity, constraints.venueMonitorConstraint, ensureErrorHandler);
  await venueMonitorRepository.update(entity);
};

exports.save = async function(venueId, venueMonitor) {
  if (!venueMonitor) {
    return;
  }

  const existingVenueMonitor = await venueMonitorRepository.tryGet(venueId);
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

  await venueMonitorRepository.put(result);
};
