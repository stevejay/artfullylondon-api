'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const strategyRunner = require('../../lib/venue-processing/venue-strategy-runner');
const strategyFactory = require('../../lib/venue-processing/venue-strategy-factory');
const venueIterationService = require('../../lib/services/venue-iteration-service');
const venueService = require('../../lib/services/venue-service');
const venueEventMonitorService = require('../../lib/services/venue-event-monitor-service');
const venueMonitorService = require('../../lib/services/venue-monitor-service');

describe('venue-service', () => {
  describe('processNextVenue', () => {
    afterEach(() => {
      venueIterationService.getNextVenue.restore &&
        venueIterationService.getNextVenue.restore();

      venueIterationService.invokeNextIteration.restore &&
        venueIterationService.invokeNextIteration.restore();

      strategyFactory.create.restore && strategyFactory.create.restore();

      venueIterationService.throttleIteration.restore &&
        venueIterationService.throttleIteration.restore();

      venueIterationService.addIterationError.restore &&
        venueIterationService.addIterationError.restore();

      strategyRunner.discoverEvents.restore &&
        strategyRunner.discoverEvents.restore();

      venueEventMonitorService.save.restore &&
        venueEventMonitorService.save.restore();

      strategyRunner.getVenueData.restore &&
        strategyRunner.getVenueData.restore();

      venueMonitorService.save.restore && venueMonitorService.save.restore();
    });

    it('should handle there being no next venue', done => {
      const stubGetNextVenue = sinon
        .stub(venueIterationService, 'getNextVenue')
        .callsFake(lastId => {
          expect(lastId).to.eql('almeida-theatre');
          return Promise.resolve(null);
        });

      const stubInvokeNextIteration = sinon
        .stub(venueIterationService, 'invokeNextIteration')
        .callsFake((venueId, startTimestamp) => {
          expect(venueId).to.eql(null);
          return Promise.resolve();
        });

      venueService
        .processNextVenue('almeida-theatre', process.hrtime(), 2147483647)
        .then(() => {
          expect(stubGetNextVenue.called).to.eql(true);
          expect(stubInvokeNextIteration.called).to.eql(true);
          done();
        })
        .catch(done);
    });

    it('should handle there being a next venue but it does not have a strategy', done => {
      const stubGetNextVenue = sinon
        .stub(venueIterationService, 'getNextVenue')
        .callsFake(lastId => {
          expect(lastId).to.eql('almeida-theatre');
          return Promise.resolve('tate-modern');
        });

      const stubCreate = sinon
        .stub(strategyFactory, 'create')
        .callsFake(venueId => {
          expect(venueId).to.eql('tate-modern');
          return null;
        });

      const stubThrottleIteration = sinon
        .stub(venueIterationService, 'throttleIteration')
        .callsFake((startTime, delay) => {
          expect(startTime[0]).to.be.greaterThan(0);
          expect(delay).to.eql(1000);

          return Promise.resolve();
        });

      const stubInvokeNextIteration = sinon
        .stub(venueIterationService, 'invokeNextIteration')
        .callsFake((venueId, startTimestamp) => {
          expect(venueId).to.eql('tate-modern');
          return Promise.resolve();
        });

      venueService
        .processNextVenue('almeida-theatre', process.hrtime(), 2147483647)
        .then(() => {
          expect(stubGetNextVenue.called).to.eql(true);
          expect(stubCreate.called).to.eql(true);
          expect(stubThrottleIteration.called).to.eql(true);
          expect(stubInvokeNextIteration.called).to.eql(true);

          done();
        })
        .catch(done);
    });

    it('should handle an exception being thrown when processing the venue', done => {
      const stubGetNextVenue = sinon
        .stub(venueIterationService, 'getNextVenue')
        .callsFake(lastId => {
          expect(lastId).to.eql('almeida-theatre');
          return Promise.resolve('tate-modern');
        });

      const stubCreate = sinon
        .stub(strategyFactory, 'create')
        .callsFake(venueId => {
          expect(venueId).to.eql('tate-modern');
          throw new Error('deliberately thrown');
        });

      const stubAddIterationError = sinon
        .stub(venueIterationService, 'addIterationError')
        .callsFake((err, venueId, startTimestamp) => {
          expect(err.message).to.eql('deliberately thrown');
          expect(venueId).to.eql('tate-modern');
          return Promise.resolve();
        });

      const stubThrottleIteration = sinon
        .stub(venueIterationService, 'throttleIteration')
        .callsFake((startTime, delay) => {
          expect(startTime[0]).to.be.greaterThan(0);
          expect(delay).to.eql(1000);

          return Promise.resolve();
        });

      const stubInvokeNextIteration = sinon
        .stub(venueIterationService, 'invokeNextIteration')
        .callsFake((venueId, startTimestamp) => {
          expect(venueId).to.eql('tate-modern');
          return Promise.resolve();
        });

      venueService
        .processNextVenue('almeida-theatre', process.hrtime(), 2147483647)
        .then(() => {
          expect(stubGetNextVenue.called).to.eql(true);
          expect(stubCreate.called).to.eql(true);
          expect(stubAddIterationError.called).to.eql(true);
          expect(stubThrottleIteration.called).to.eql(true);
          expect(stubInvokeNextIteration.called).to.eql(true);

          done();
        })
        .catch(done);
    });

    it('should handle there being a next venue with a strategy', done => {
      const mockStrategy = {};

      const stubGetNextVenue = sinon
        .stub(venueIterationService, 'getNextVenue')
        .callsFake(lastId => {
          expect(lastId).to.eql('almeida-theatre');
          return Promise.resolve('tate-modern');
        });

      const stubCreate = sinon
        .stub(strategyFactory, 'create')
        .callsFake(venueId => {
          expect(venueId).to.eql('tate-modern');
          return mockStrategy;
        });

      const stubDiscoverEvents = sinon
        .stub(strategyRunner, 'discoverEvents')
        .callsFake((venueId, venueStrategy) => {
          expect(venueId).to.eql('tate-modern');
          expect(venueStrategy).to.eql(mockStrategy);

          return Promise.resolve([{ id: 'some-event-id' }]);
        });

      const stubSaveEventMonitors = sinon
        .stub(venueEventMonitorService, 'save')
        .callsFake((venueId, discoveredEvents) => {
          expect(venueId).to.eql('tate-modern');
          expect(discoveredEvents).to.eql([{ id: 'some-event-id' }]);

          return Promise.resolve();
        });

      const stubGetVenueData = sinon
        .stub(strategyRunner, 'getVenueData')
        .callsFake(venueStrategy => {
          expect(venueStrategy).to.eql(mockStrategy);
          return Promise.resolve({ text: 'Venue data' });
        });

      const stubSaveVenueMonitors = sinon
        .stub(venueMonitorService, 'save')
        .callsFake((venueId, venueData) => {
          expect(venueId).to.eql('tate-modern');
          expect(venueData).to.eql({ text: 'Venue data' });

          return Promise.resolve();
        });

      const stubThrottleIteration = sinon
        .stub(venueIterationService, 'throttleIteration')
        .callsFake((startTime, delay) => {
          expect(startTime[0]).to.be.greaterThan(0);
          expect(delay).to.eql(1000);
          return Promise.resolve();
        });

      const stubInvokeNextIteration = sinon
        .stub(venueIterationService, 'invokeNextIteration')
        .callsFake((venueId, startTimestamp) => {
          expect(venueId).to.eql('tate-modern');
          return Promise.resolve();
        });

      venueService
        .processNextVenue('almeida-theatre', process.hrtime(), 2147483647)
        .then(() => {
          expect(stubGetNextVenue.called).to.eql(true);
          expect(stubCreate.called).to.eql(true);
          expect(stubDiscoverEvents.called).to.eql(true);
          expect(stubSaveEventMonitors.called).to.eql(true);
          expect(stubGetVenueData.called).to.eql(true);
          expect(stubSaveVenueMonitors.called).to.eql(true);
          expect(stubThrottleIteration.called).to.eql(true);
          expect(stubInvokeNextIteration.called).to.eql(true);

          done();
        })
        .catch(done);
    });

    it('should handle the venue taking too long to be processed', done => {
      const mockStrategy = {};

      const stubGetNextVenue = sinon
        .stub(venueIterationService, 'getNextVenue')
        .callsFake(lastId => {
          expect(lastId).to.eql('almeida-theatre');
          return Promise.resolve('tate-modern');
        });

      const stubCreate = sinon
        .stub(strategyFactory, 'create')
        .callsFake(venueId => {
          expect(venueId).to.eql('tate-modern');
          return mockStrategy;
        });

      const stubDiscoverEvents = sinon
        .stub(strategyRunner, 'discoverEvents')
        .callsFake(
          (venueId, venueStrategy) =>
            new Promise(resolve => setTimeout(() => resolve(), 50000))
        );

      const stubAddIterationError = sinon
        .stub(venueIterationService, 'addIterationError')
        .callsFake((err, venueId, startTimestamp) => {
          expect(err.message).to.eql('processing venue took too long');
          expect(venueId).to.eql('tate-modern');
          expect(startTimestamp).to.eql(12345678);

          return Promise.resolve();
        });

      const stubInvokeNextIteration = sinon
        .stub(venueIterationService, 'invokeNextIteration')
        .callsFake((venueId, startTimestamp) => {
          expect(venueId).to.eql('tate-modern');
          expect(startTimestamp).to.eql(12345678);

          return Promise.resolve();
        });

      venueService
        .processNextVenue('almeida-theatre', 12345678, 100)
        .then(() => {
          expect(stubGetNextVenue.called).to.eql(true);
          expect(stubCreate.called).to.eql(true);
          expect(stubAddIterationError.called).to.eql(true);
          expect(stubInvokeNextIteration.called).to.eql(true);

          done();
        })
        .catch(done);
    });
  });
});
