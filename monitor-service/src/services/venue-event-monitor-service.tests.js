'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const diff = require('../../lib/venue-processing/diff');
const venueEventMonitorRepository = require('../../lib/persistence/venue-event-monitor-repository');
const venueEventMonitorService = require('../../lib/services/venue-event-monitor-service');

describe('venue-event-monitor-service', () => {
  describe('updateVenueEventMonitor', () => {
    afterEach(() => {
      venueEventMonitorRepository.update.restore &&
        venueEventMonitorRepository.update.restore();
    });

    it('should update a venue event monitor', done => {
      sinon.stub(venueEventMonitorRepository, 'update').callsFake(entity => {
        expect(entity).toEqual({
          venueId: 'some-id',
          externalEventId: 'external-id',
          isIgnored: true,
          hasChanged: false,
        });

        return Promise.resolve();
      });

      venueEventMonitorService
        .updateVenueEventMonitor({
          venueId: 'some-id',
          externalEventId: 'external-id',
          isIgnored: true,
          hasChanged: false,
        })
        .then(() => done())
        .catch(done);
    });

    it('should throw an error when updating a venue event monitor with invalid values', done => {
      venueEventMonitorService
        .updateVenueEventMonitor({
          venueId: 'some-id',
          isIgnored: true,
          hasChanged: false,
        })
        .then(() => done(new Error('should have thrown an exception')))
        .catch(() => done());
    });
  });

  describe('getVenueEventMonitorsForVenue', () => {
    afterEach(() => {
      venueEventMonitorRepository.getAllForVenue.restore &&
        venueEventMonitorRepository.getAllForVenue.restore();
    });

    it('should get the venue event monitors for a venue', done => {
      sinon
        .stub(venueEventMonitorRepository, 'getAllForVenue')
        .callsFake(venueId => {
          expect(venueId).toEqual('almeida-theatre');
          return Promise.resolve([{ id: 'some-id' }]);
        });

      venueEventMonitorService
        .getVenueEventMonitorsForVenue('almeida-theatre')
        .then(result => {
          expect(result).toEqual([{ id: 'some-id' }]);
          done();
        })
        .catch(done);
    });
  });

  describe('getVenueEventMonitor', () => {
    afterEach(() => {
      venueEventMonitorRepository.get.restore &&
        venueEventMonitorRepository.get.restore();

      diff.getDiff.restore && diff.getDiff.restore();
    });

    it('should get a venue event monitor with no diff', done => {
      sinon
        .stub(venueEventMonitorRepository, 'get')
        .callsFake((venueId, externalEventId) => {
          expect(venueId).toEqual('almeida-theatre');
          expect(externalEventId).toEqual('external-id');

          return Promise.resolve({
            id: 'some-id',
            oldEventText: 'old event text',
            eventText: 'event text',
          });
        });

      sinon.stub(diff, 'getDiff').callsFake((oldEventText, eventText) => {
        expect(oldEventText).toEqual('old event text');
        expect(eventText).toEqual('event text');

        return Promise.resolve(null);
      });

      venueEventMonitorService
        .getVenueEventMonitor('almeida-theatre', 'external-id')
        .then(result => {
          expect(result).toEqual({ id: 'some-id' });
          done();
        })
        .catch(done);
    });

    it('should get a venue event monitor with a diff', done => {
      sinon
        .stub(venueEventMonitorRepository, 'get')
        .callsFake((venueId, externalEventId) => {
          expect(venueId).toEqual('almeida-theatre');
          expect(externalEventId).toEqual('external-id');

          return Promise.resolve({
            id: 'some-id',
            oldEventText: 'old event text',
            eventText: 'event text',
          });
        });

      sinon.stub(diff, 'getDiff').callsFake((oldEventText, eventText) => {
        expect(oldEventText).toEqual('old event text');
        expect(eventText).toEqual('event text');

        return Promise.resolve('change diff text');
      });

      venueEventMonitorService
        .getVenueEventMonitor('almeida-theatre', 'external-id')
        .then(result => {
          expect(result).toEqual({
            id: 'some-id',
            changeDiff: 'change diff text',
          });

          done();
        })
        .catch(done);
    });
  });

  describe('save', () => {
    afterEach(() => {
      venueEventMonitorRepository.tryGet.restore &&
        venueEventMonitorRepository.tryGet.restore();

      venueEventMonitorRepository.put.restore &&
        venueEventMonitorRepository.put.restore();
    });

    it('should handle saving no event monitors', done => {
      venueEventMonitorService
        .save('almeida-theatre', [])
        .then(done)
        .catch(done);
    });

    it('should handle saving new combined events event monitors when none already exist', done => {
      const getStub = sinon
        .stub(venueEventMonitorRepository, 'tryGet')
        .callsFake((venueId, externalEventId) => {
          expect(venueId).toEqual('almeida-theatre');
          expect(externalEventId).toEqual('almeida-theatre|/');

          return Promise.resolve(null);
        });

      sinon
        .stub(venueEventMonitorRepository, 'put')
        .callsFake(entities => {
          expect(entities).toEqual({
            venueId: 'almeida-theatre',
            externalEventId: 'almeida-theatre|/',
            isIgnored: false,
            title: 'Combined Events',
            inArtfully: false,
            combinedEvents: true,
            hasChanged: true,
            eventText: 'Foo',
          });
          return Promise.resolve();
        });

      const eventMonitors = [
        {
          externalEventId: 'almeida-theatre|/',
          title: 'Combined Events',
          eventText: 'Foo',
          combinedEvents: true,
        },
      ];

      venueEventMonitorService
        .save('almeida-theatre', eventMonitors)
        .then(() => {
          expect(getStub.called).toEqual(true);
          expect(getStub.called).toEqual(true);
          done();
        })
        .catch(done);
    });

    it('should handle saving new page-per-event event monitors when none already exist', done => {
      const getStub = sinon
        .stub(venueEventMonitorRepository, 'tryGet')
        .callsFake((venueId, externalEventId) => {
          expect(venueId).toEqual('almeida-theatre');
          expect(externalEventId).toEqual('almeida-theatre|/');

          return Promise.resolve(null);
        });

      const putStub = sinon
        .stub(venueEventMonitorRepository, 'put')
        .callsFake(entities => {
          expect(entities).toEqual({
            venueId: 'almeida-theatre',
            externalEventId: 'almeida-theatre|/',
            currentUrl: 'http://almeida.com/foo',
            isIgnored: false,
            title: 'Some Event',
            inArtfully: true,
            artfullyEventId: 'almeida-theatre/2017/bar',
            hasChanged: false,
            eventText: 'description',
            combinedEvents: false,
          });
          return Promise.resolve();
        });

      const eventMonitors = [
        {
          externalEventId: 'almeida-theatre|/',
          currentUrl: 'http://almeida.com/foo',
          title: 'Some Event',
          eventText: 'description',
          inArtfully: true,
          artfullyEventId: 'almeida-theatre/2017/bar',
          combinedEvents: false,
        },
      ];

      venueEventMonitorService
        .save('almeida-theatre', eventMonitors)
        .then(() => {
          expect(getStub.called).toEqual(true);
          expect(putStub.called).toEqual(true);
          done();
        })
        .catch(done);
    });

    it('should handle saving a combined events event monitor that already exists where the event text changes', done => {
      const getStub = sinon
        .stub(venueEventMonitorRepository, 'tryGet')
        .callsFake((venueId, externalEventId) => {
          expect(venueId).toEqual('almeida-theatre');
          expect(externalEventId).toEqual('almeida-theatre|/');

          return Promise.resolve({
            venueId: 'almeida-theatre',
            externalEventId: 'almeida-theatre|/',
            title: 'http://test.com/old-title',
            isIgnored: false,
            inArtfully: false,
            hasChanged: true,
            eventText: 'old description',
          });
        });

      const putStub = sinon
        .stub(venueEventMonitorRepository, 'put')
        .callsFake(entities => {
          expect(entities).toEqual({
            venueId: 'almeida-theatre',
            externalEventId: 'almeida-theatre|/',
            isIgnored: false,
            title: 'Combined Events',
            inArtfully: false,
            combinedEvents: true,
            hasChanged: true,
            eventText: 'new description',
            oldEventText: 'old description',
          });
          return Promise.resolve();
        });

      const eventMonitors = [
        {
          externalEventId: 'almeida-theatre|/',
          title: 'Combined Events',
          eventText: 'new description',
          combinedEvents: true,
        },
      ];

      venueEventMonitorService
        .save('almeida-theatre', eventMonitors)
        .then(() => {
          expect(getStub.called).toEqual(true);
          expect(putStub.called).toEqual(true);
          done();
        })
        .catch(done);
    });

    it('should handle saving a combined events event monitor that already exists where the old event text is restored', done => {
      const getStub = sinon
        .stub(venueEventMonitorRepository, 'tryGet')
        .callsFake((venueId, externalEventId) => {
          expect(venueId).toEqual('almeida-theatre');
          expect(externalEventId).toEqual('almeida-theatre|/');

          return Promise.resolve({
            venueId: 'almeida-theatre',
            externalEventId: 'almeida-theatre|/',
            title: 'http://test.com/old-title',
            isIgnored: false,
            inArtfully: false,
            hasChanged: true,
            oldEventText: 'old description',
            eventText: 'new description',
          });
        });

      const putStub = sinon
        .stub(venueEventMonitorRepository, 'put')
        .callsFake(entities => {
          expect(entities).toEqual({
            venueId: 'almeida-theatre',
            externalEventId: 'almeida-theatre|/',
            isIgnored: false,
            title: 'Combined Events',
            inArtfully: false,
            combinedEvents: true,
            hasChanged: false,
            eventText: 'old description',
          });
          return Promise.resolve();
        });

      const eventMonitors = [
        {
          externalEventId: 'almeida-theatre|/',
          title: 'Combined Events',
          eventText: 'old description',
          combinedEvents: true,
        },
      ];

      venueEventMonitorService
        .save('almeida-theatre', eventMonitors)
        .then(() => {
          expect(getStub.called).toEqual(true);
          expect(putStub.called).toEqual(true);
          done();
        })
        .catch(done);
    });

    it('should handle saving a combined events event monitor that already exists where event text gets updated', done => {
      const getStub = sinon
        .stub(venueEventMonitorRepository, 'tryGet')
        .callsFake((venueId, externalEventId) => {
          expect(venueId).toEqual('almeida-theatre');
          expect(externalEventId).toEqual('almeida-theatre|/');

          return Promise.resolve({
            venueId: 'almeida-theatre',
            externalEventId: 'almeida-theatre|/',
            title: 'http://test.com/old-title',
            isIgnored: false,
            inArtfully: false,
            hasChanged: false,
            eventText: 'description',
          });
        });

      const putStub = sinon
        .stub(venueEventMonitorRepository, 'put')
        .callsFake(entities => {
          expect(entities).toEqual({
            venueId: 'almeida-theatre',
            externalEventId: 'almeida-theatre|/',
            isIgnored: false,
            title: 'Combined Events',
            inArtfully: false,
            combinedEvents: true,
            hasChanged: true,
            eventText: 'new description',
            oldEventText: 'description',
          });
          return Promise.resolve();
        });

      const eventMonitors = [
        {
          externalEventId: 'almeida-theatre|/',
          title: 'Combined Events',
          eventText: 'new description',
          combinedEvents: true,
        },
      ];

      venueEventMonitorService
        .save('almeida-theatre', eventMonitors)
        .then(() => {
          expect(getStub.called).toEqual(true);
          expect(putStub.called).toEqual(true);
          done();
        })
        .catch(done);
    });

    it('should handle saving a combined events event monitor that already exists where event text is the same', done => {
      const getStub = sinon
        .stub(venueEventMonitorRepository, 'tryGet')
        .callsFake((venueId, externalEventId) => {
          expect(venueId).toEqual('almeida-theatre');
          expect(externalEventId).toEqual('almeida-theatre|/');

          return Promise.resolve({
            venueId: 'almeida-theatre',
            externalEventId: 'almeida-theatre|/',
            title: 'http://test.com/old-title',
            isIgnored: false,
            inArtfully: false,
            hasChanged: false,
            eventText: 'description',
          });
        });

      const putStub = sinon
        .stub(venueEventMonitorRepository, 'put')
        .callsFake(entities => {
          expect(entities).toEqual({
            venueId: 'almeida-theatre',
            externalEventId: 'almeida-theatre|/',
            isIgnored: false,
            title: 'Combined Events',
            inArtfully: false,
            combinedEvents: true,
            hasChanged: false,
            eventText: 'description',
          });
          return Promise.resolve();
        });

      const eventMonitors = [
        {
          externalEventId: 'almeida-theatre|/',
          title: 'Combined Events',
          eventText: 'description',
          combinedEvents: true,
        },
      ];

      venueEventMonitorService
        .save('almeida-theatre', eventMonitors)
        .then(() => {
          expect(getStub.called).toEqual(true);
          expect(putStub.called).toEqual(true);
          done();
        })
        .catch(done);
    });

    it('should handle saving a combined events event monitor that already exists and hasChanged is preserved', done => {
      const getStub = sinon
        .stub(venueEventMonitorRepository, 'tryGet')
        .callsFake((venueId, externalEventId) => {
          expect(venueId).toEqual('almeida-theatre');
          expect(externalEventId).toEqual('almeida-theatre|/');

          return Promise.resolve({
            venueId: 'almeida-theatre',
            externalEventId: 'almeida-theatre|/',
            title: 'http://test.com/old-title',
            isIgnored: false,
            inArtfully: false,
            combinedEvents: true,
            hasChanged: true,
            eventText: 'description',
          });
        });

      const putStub = sinon
        .stub(venueEventMonitorRepository, 'put')
        .callsFake(entities => {
          expect(entities).toEqual({
            venueId: 'almeida-theatre',
            externalEventId: 'almeida-theatre|/',
            isIgnored: false,
            title: 'Combined Events',
            inArtfully: false,
            combinedEvents: true,
            hasChanged: true,
            eventText: 'description',
          });
          return Promise.resolve();
        });

      const eventMonitors = [
        {
          externalEventId: 'almeida-theatre|/',
          title: 'Combined Events',
          eventText: 'description',
          combinedEvents: true,
        },
      ];

      venueEventMonitorService
        .save('almeida-theatre', eventMonitors)
        .then(() => {
          expect(getStub.called).toEqual(true);
          expect(putStub.called).toEqual(true);
          done();
        })
        .catch(done);
    });
  });
});
