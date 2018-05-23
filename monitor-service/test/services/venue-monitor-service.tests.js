'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const diff = require('../../lib/venue-processing/diff');
const venueMonitorRepository = require('../../lib/persistence/venue-monitor-repository');
const venueMonitorService = require('../../lib/services/venue-monitor-service');

describe('venue-monitor-service', () => {
  describe('updateVenueMonitor', () => {
    afterEach(() => {
      venueMonitorRepository.update.restore &&
        venueMonitorRepository.update.restore();
    });

    it('should update a venue monitor', done => {
      sinon.stub(venueMonitorRepository, 'update').callsFake(entity => {
        expect(entity).toEqual({
          venueId: 'some-id',
          isIgnored: true,
          hasChanged: false,
        });

        return Promise.resolve();
      });

      venueMonitorService
        .updateVenueMonitor({
          venueId: 'some-id',
          isIgnored: true,
          hasChanged: false,
        })
        .then(() => done())
        .catch(done);
    });

    it('should throw an error when updating a venue monitor with invalid values', done => {
      venueMonitorService
        .updateVenueMonitor({
          venueId: 'some-id',
          hasChanged: false,
        })
        .then(() => done(new Error('should have thrown an exception')))
        .catch(() => done());
    });
  });

  describe('getVenueMonitors', () => {
    afterEach(() => {
      venueMonitorRepository.tryGet.restore &&
        venueMonitorRepository.tryGet.restore();

      diff.getDiff.restore && diff.getDiff.restore();
    });

    it('should handle getting a non-existent venue monitor', done => {
      sinon.stub(venueMonitorRepository, 'tryGet').callsFake(venueId => {
        expect(venueId).toEqual('almeida-theatre');
        return Promise.resolve(null);
      });

      venueMonitorService
        .getVenueMonitors('almeida-theatre')
        .then(result => {
          expect(result).toEqual([]);
          done();
        })
        .catch(done);
    });

    it('should get a venue monitor with no diff', done => {
      sinon.stub(venueMonitorRepository, 'tryGet').callsFake(venueId => {
        expect(venueId).toEqual('almeida-theatre');

        return Promise.resolve({
          id: 'some-id',
          oldVenueText: 'old venue text',
          venueText: 'venue text',
        });
      });

      sinon.stub(diff, 'getDiff').callsFake((oldVenueText, venueText) => {
        expect(oldVenueText).toEqual('old venue text');
        expect(venueText).toEqual('venue text');

        return Promise.resolve(null);
      });

      venueMonitorService
        .getVenueMonitors('almeida-theatre')
        .then(result => {
          expect(result).toEqual([{ id: 'some-id' }]);
          done();
        })
        .catch(done);
    });

    it('should get a venue monitor with a diff', done => {
      sinon.stub(venueMonitorRepository, 'tryGet').callsFake(venueId => {
        expect(venueId).toEqual('almeida-theatre');

        return Promise.resolve({
          id: 'some-id',
          oldVenueText: 'old venue text',
          venueText: 'venue text',
        });
      });

      sinon.stub(diff, 'getDiff').callsFake((oldVenueText, venueText) => {
        expect(oldVenueText).toEqual('old venue text');
        expect(venueText).toEqual('venue text');

        return Promise.resolve('change diff text');
      });

      venueMonitorService
        .getVenueMonitors('almeida-theatre')
        .then(result => {
          expect(result).toEqual([{
            id: 'some-id',
            changeDiff: 'change diff text',
          }]);

          done();
        })
        .catch(done);
    });
  });

  describe('save', () => {
    afterEach(() => {
      venueMonitorRepository.tryGet.restore &&
        venueMonitorRepository.tryGet.restore();

      venueMonitorRepository.put.restore &&
        venueMonitorRepository.put.restore();
    });

    it('should handle saving no venue monitor', done => {
      venueMonitorService.save('almeida-theatre', null).then(done).catch(done);
    });

    it('should handle saving venue monitor when it does not already exist', done => {
      const tryGetStub = sinon
        .stub(venueMonitorRepository, 'tryGet')
        .callsFake(venueId => {
          expect(venueId).toEqual('almeida-theatre');
          return Promise.resolve(null);
        });

      const putStub = sinon
        .stub(venueMonitorRepository, 'put')
        .callsFake(param => {
          expect(param).toEqual({
            venueId: 'almeida-theatre',
            venueText: 'Foo',
            isIgnored: false,
            hasChanged: false,
          });

          return Promise.resolve();
        });

      const venueMonitor = {
        venueText: 'Foo',
      };

      venueMonitorService
        .save('almeida-theatre', venueMonitor)
        .then(() => {
          expect(tryGetStub.called).toEqual(true);
          expect(putStub.called).toEqual(true);
          done();
        })
        .catch(done);
    });

    it('should handle saving venue monitor when it exists already with no old venue text and venue text is not updated', done => {
      const tryGetStub = sinon
        .stub(venueMonitorRepository, 'tryGet')
        .callsFake(venueId => {
          expect(venueId).toEqual('almeida-theatre');

          return Promise.resolve({
            venueId: 'almeida-theatre',
            venueText: 'some text',
            isIgnored: false,
            hasChanged: false,
          });
        });

      const putStub = sinon
        .stub(venueMonitorRepository, 'put')
        .callsFake(param => {
          expect(param).toEqual({
            venueId: 'almeida-theatre',
            venueText: 'some text',
            isIgnored: false,
            hasChanged: false,
          });

          return Promise.resolve();
        });

      const venueMonitor = {
        venueText: 'some text',
      };

      venueMonitorService
        .save('almeida-theatre', venueMonitor)
        .then(() => {
          expect(tryGetStub.called).toEqual(true);
          expect(putStub.called).toEqual(true);
          done();
        })
        .catch(done);
    });

    it('should handle saving venue monitor when it exists already with no old venue text and venue text is updated', done => {
      const tryGetStub = sinon
        .stub(venueMonitorRepository, 'tryGet')
        .callsFake(venueId => {
          expect(venueId).toEqual('almeida-theatre');

          return Promise.resolve({
            venueId: 'almeida-theatre',
            venueText: 'some text',
            isIgnored: false,
            hasChanged: false,
          });
        });

      const putStub = sinon
        .stub(venueMonitorRepository, 'put')
        .callsFake(param => {
          expect(param).toEqual({
            venueId: 'almeida-theatre',
            oldVenueText: 'some text',
            venueText: 'some new text',
            isIgnored: false,
            hasChanged: true,
          });

          return Promise.resolve();
        });

      const venueMonitor = {
        venueText: 'some new text',
      };

      venueMonitorService
        .save('almeida-theatre', venueMonitor)
        .then(() => {
          expect(tryGetStub.called).toEqual(true);
          expect(putStub.called).toEqual(true);
          done();
        })
        .catch(done);
    });

    it('should handle saving venue monitor when it exists already with old venue text and updated venue text is same as old', done => {
      const tryGetStub = sinon
        .stub(venueMonitorRepository, 'tryGet')
        .callsFake(venueId => {
          expect(venueId).toEqual('almeida-theatre');

          return Promise.resolve({
            venueId: 'almeida-theatre',
            oldVenueText: 'some old text',
            venueText: 'some text',
            isIgnored: false,
            hasChanged: true,
          });
        });

      const putStub = sinon
        .stub(venueMonitorRepository, 'put')
        .callsFake(param => {
          expect(param).toEqual({
            venueId: 'almeida-theatre',
            venueText: 'some old text',
            isIgnored: false,
            hasChanged: false,
          });

          return Promise.resolve();
        });

      const venueMonitor = {
        venueText: 'some old text',
      };

      venueMonitorService
        .save('almeida-theatre', venueMonitor)
        .then(() => {
          expect(tryGetStub.called).toEqual(true);
          expect(putStub.called).toEqual(true);
          done();
        })
        .catch(done);
    });

    it('should handle saving venue monitor when it exists already with old venue text and updated venue text is different', done => {
      const tryGetStub = sinon
        .stub(venueMonitorRepository, 'tryGet')
        .callsFake(venueId => {
          expect(venueId).toEqual('almeida-theatre');

          return Promise.resolve({
            venueId: 'almeida-theatre',
            oldVenueText: 'some old text',
            venueText: 'some text',
            isIgnored: false,
            hasChanged: true,
          });
        });

      const putStub = sinon
        .stub(venueMonitorRepository, 'put')
        .callsFake(param => {
          expect(param).toEqual({
            venueId: 'almeida-theatre',
            oldVenueText: 'some old text',
            venueText: 'some new text',
            isIgnored: false,
            hasChanged: true,
          });

          return Promise.resolve();
        });

      const venueMonitor = {
        venueText: 'some new text',
      };

      venueMonitorService
        .save('almeida-theatre', venueMonitor)
        .then(() => {
          expect(tryGetStub.called).toEqual(true);
          expect(putStub.called).toEqual(true);
          done();
        })
        .catch(done);
    });
  });
});
