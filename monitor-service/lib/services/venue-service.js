'use strict';

const co = require('co');
const strategyFactory = require('../venue-processing/venue-strategy-factory');
const strategyRunner = require('../venue-processing/venue-strategy-runner');
const venueEventMonitorService = require('./venue-event-monitor-service');
const venueMonitorService = require('./venue-monitor-service');
const venueIterationService = require('./venue-iteration-service');

exports.startIteration = () => venueIterationService.startIteration();

const doProcessNextVenue = co.wrap(function* doProcessNextVenue(
  venueId,
  startTimestamp
) {
  if (venueId) {
    const startTime = process.hrtime();

    try {
      const venueStrategy = strategyFactory.create(venueId);

      if (venueStrategy) {
        const discoveredEvents = yield strategyRunner.discoverEvents(
          venueId,
          venueStrategy
        );

        yield venueEventMonitorService.save(venueId, discoveredEvents);

        const venueData = yield strategyRunner.getVenueData(venueStrategy);
        yield venueMonitorService.save(venueId, venueData);
      }
    } catch (err) {
      yield venueIterationService.addIterationError(
        err,
        venueId,
        startTimestamp
      );
    }

    yield venueIterationService.throttleIteration(startTime, 1000);
  }
});

exports.processNextVenue = co.wrap(function*(
  lastId,
  startTimestamp,
  timeout
) {
  const venueId = yield venueIterationService.getNextVenue(lastId);
  let timeoutHandle = null;

  yield Promise.race([
    doProcessNextVenue(venueId, startTimestamp),
    new Promise((resolve, reject) => {
      timeoutHandle = setTimeout(
        () => reject(new Error('processing venue took too long')),
        timeout
      );
    }),
  ])
    .then(
      () =>
        new Promise(resolve => {
          clearTimeout(timeoutHandle);
          resolve();
        })
    )
    .catch(err =>
      venueIterationService.addIterationError(err, venueId, startTimestamp)
    )
    .then(() =>
      venueIterationService.invokeNextIteration(venueId, startTimestamp)
    );
});
