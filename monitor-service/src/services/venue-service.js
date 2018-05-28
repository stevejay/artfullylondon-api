"use strict";

const strategyFactory = require("../venue-processing/venue-strategy-factory");
const strategyRunner = require("../venue-processing/venue-strategy-runner");
const venueEventMonitorService = require("./venue-event-monitor-service");
const venueMonitorService = require("./venue-monitor-service");
const venueIterationService = require("./venue-iteration-service");

exports.startIteration = () => venueIterationService.startIteration();

const doProcessNextVenue = async function doProcessNextVenue(
  venueId,
  startTimestamp
) {
  if (venueId) {
    const startTime = process.hrtime();

    try {
      const venueStrategy = strategyFactory.create(venueId);

      if (venueStrategy) {
        const discoveredEvents = await strategyRunner.discoverEvents(
          venueId,
          venueStrategy
        );

        await venueEventMonitorService.save(venueId, discoveredEvents);

        const venueData = await strategyRunner.getVenueData(venueStrategy);
        await venueMonitorService.save(venueId, venueData);
      }
    } catch (err) {
      await venueIterationService.addIterationError(
        err,
        venueId,
        startTimestamp
      );
    }

    await venueIterationService.throttleIteration(startTime, 1000);
  }
};

exports.processNextVenue = async function(lastId, startTimestamp, timeout) {
  const venueId = await venueIterationService.getNextVenue(lastId);
  let timeoutHandle = null;

  try {
    await Promise.race([
      doProcessNextVenue(venueId, startTimestamp),
      new Promise((resolve, reject) => {
        timeoutHandle = setTimeout(
          () => reject(new Error("processing venue took too long")),
          timeout
        );
      })
    ]);

    clearTimeout(timeoutHandle);
  } catch (err) {
    await venueIterationService.addIterationError(err, venueId, startTimestamp);
  }

  await venueIterationService.invokeNextIteration(venueId, startTimestamp);
};
