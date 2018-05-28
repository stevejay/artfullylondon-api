"use strict";

const ensure = require("ensure-request").ensure;
const ensureErrorHandler = require("../validation/ensure-error-handler");
const constraints = require("../validation/constraints");
const venueEventMonitorRepository = require("../persistence/venue-event-monitor-repository");
const venueIterationService = require("./venue-iteration-service");
const diff = require("../venue-processing/diff");

exports.getVenueEventMonitor = async function(venueId, externalEventId) {
  const dbItem = await venueEventMonitorRepository.get(
    venueId,
    externalEventId
  );

  const changeDiff = await diff.getDiff(dbItem.oldEventText, dbItem.eventText);

  if (changeDiff) {
    dbItem.changeDiff = changeDiff;
  }

  delete dbItem.oldEventText;
  delete dbItem.eventText;

  return dbItem;
};

exports.getVenueEventMonitorsForVenue = venueId =>
  venueEventMonitorRepository.getAllForVenue(venueId);

exports.updateVenueEventMonitor = async entity => {
  ensure(entity, constraints.venueEventMonitorConstraint, ensureErrorHandler);
  await venueEventMonitorRepository.update(entity);
};

exports.save = async function(venueId, eventMonitors) {
  if (eventMonitors.length === 0) {
    return;
  }

  for (var i = 0; i < eventMonitors.length; ++i) {
    const startTime = process.hrtime();
    const newEventMonitor = eventMonitors[i];

    const existingEventMonitor = await venueEventMonitorRepository.tryGet(
      venueId,
      newEventMonitor.externalEventId
    );

    let result = {};

    if (existingEventMonitor) {
      if (!existingEventMonitor.oldEventText) {
        if (existingEventMonitor.eventText !== newEventMonitor.eventText) {
          result.oldEventText = existingEventMonitor.eventText;
          result.hasChanged = true;
        } else {
          result.hasChanged = existingEventMonitor.hasChanged || false;
        }
      } else {
        if (existingEventMonitor.oldEventText === newEventMonitor.eventText) {
          result.hasChanged = false;
        } else {
          result.oldEventText = existingEventMonitor.oldEventText;
          result.hasChanged = true;
        }
      }

      result.isIgnored = existingEventMonitor.isIgnored;
    } else {
      result.isIgnored = false;
      result.hasChanged = newEventMonitor.combinedEvents || false;
    }

    result.eventText = newEventMonitor.eventText;
    result.inArtfully = newEventMonitor.inArtfully || false;
    result.title = newEventMonitor.title;
    result.venueId = venueId;
    result.externalEventId = newEventMonitor.externalEventId;
    result.combinedEvents = newEventMonitor.combinedEvents;

    if (newEventMonitor.artfullyEventId) {
      result.artfullyEventId = newEventMonitor.artfullyEventId;
    }

    if (newEventMonitor.currentUrl) {
      result.currentUrl = newEventMonitor.currentUrl;
    }

    await venueEventMonitorRepository.put(result);
    await venueIterationService.throttleIteration(startTime, 250);
  }
};
