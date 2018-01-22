'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const userService = require('../../lib/services/user-service');
const watchesService = require('../../lib/services/watches-service');
const preferencesService = require('../../lib/services/preferences-service');
const watchRepository = require('../../lib/persistence/watch-repository');
const constants = require('../../lib/constants');

describe('user-service', () => {
  describe('getWatches', () => {
    afterEach(() => {
      watchesService.getWatches.restore && watchesService.getWatches.restore();
    });

    it('should handle a valid request', done => {
      sinon
        .stub(watchesService, 'getWatches')
        .callsFake((userId, entityType) => {
          expect(userId).to.eql('1234');
          expect(entityType).to.eql('talent');
          return Promise.resolve([{ foo: 'bar' }]);
        });

      userService
        .getWatches({ userId: '1234', entityType: 'talent' })
        .then(response => {
          expect(response).to.eql([{ foo: 'bar' }]);
          done();
        })
        .catch(done);
    });

    it('should handle an invalid request', done => {
      userService
        .getWatches({ userId: '1234', entityType: 'unknown' })
        .then(() => done(new Error('should have thrown an exception')))
        .catch(() => done());
    });
  });

  describe('updatePreferences', () => {
    afterEach(() => {
      preferencesService.updatePreferences.restore &&
        preferencesService.updatePreferences.restore();
    });

    it('should handle a valid request', done => {
      sinon
        .stub(preferencesService, 'updatePreferences')
        .callsFake((userId, preferences) => {
          expect(userId).to.eql('1234');

          expect(preferences).to.eql({
            userId: '1234',
            emailFrequency: 'Daily',
          });

          return Promise.resolve();
        });

      userService
        .updatePreferences({
          userId: '1234',
          preferences: { emailFrequency: 'Daily' },
        })
        .then(() => done())
        .catch(done);
    });

    it('should handle an invalid request', done => {
      userService
        .updatePreferences({
          userId: '1234',
          preferences: { emailFrequency: 'unknown' },
        })
        .then(() => done(new Error('should have thrown an exception')))
        .catch(() => done());
    });
  });

  describe('updateWatches', () => {
    afterEach(() => {
      watchesService.getWatches.restore && watchesService.getWatches.restore();

      watchRepository.createOrUpdateWatches.restore &&
        watchRepository.createOrUpdateWatches.restore();
    });

    it('should handle stale data', done => {
      sinon
        .stub(watchesService, 'getWatches')
        .callsFake((userId, entityType) => {
          expect(userId).to.eql('1234');
          expect(entityType).to.eql('talent');

          return Promise.resolve({ version: 1 });
        });

      userService
        .updateWatches({
          newVersion: 1,
          userId: '1234',
          entityType: 'talent',
          changes: [],
        })
        .then(() => done(new Error('should have thrown an exception')))
        .catch(err =>
          done(
            err.message === '[400] Stale data'
              ? null
              : new Error('wrong exception thrown: ' + err.message)
          )
        );
    });

    it('should handle no changes', done => {
      sinon
        .stub(watchesService, 'getWatches')
        .callsFake((userId, entityType) => {
          expect(userId).to.eql('1234');
          expect(entityType).to.eql('talent');

          return Promise.resolve({ version: 1, items: [] });
        });

      sinon
        .stub(watchRepository, 'createOrUpdateWatches')
        .callsFake((currentVersion, newVersion, userId, entityType, items) => {
          expect(currentVersion).to.eql(1);
          expect(newVersion).to.eql(2);
          expect(userId).to.eql('1234');
          expect(entityType).to.eql('talent');
          expect(items).to.eql([]);

          return Promise.resolve();
        });

      userService
        .updateWatches({
          newVersion: 2,
          userId: '1234',
          entityType: 'talent',
          changes: [],
        })
        .then(() => done())
        .catch(done);
    });

    it('should handle deletions', done => {
      sinon
        .stub(watchesService, 'getWatches')
        .callsFake((userId, entityType) => {
          expect(userId).to.eql('1234');
          expect(entityType).to.eql('talent');

          return Promise.resolve({
            version: 1,
            items: [{ id: 'watch-1' }, { id: 'watch-2' }],
          });
        });

      sinon
        .stub(watchRepository, 'createOrUpdateWatches')
        .callsFake((currentVersion, newVersion, userId, entityType, items) => {
          expect(currentVersion).to.eql(1);
          expect(newVersion).to.eql(2);
          expect(userId).to.eql('1234');
          expect(entityType).to.eql('talent');
          expect(items).to.eql([{ id: 'watch-2' }]);

          return Promise.resolve();
        });

      userService
        .updateWatches({
          newVersion: 2,
          userId: '1234',
          entityType: 'talent',
          changes: [
            {
              changeType: constants.WATCH_CHANGE_TYPE_DELETE,
              id: 'watch-1',
            },
          ],
        })
        .then(() => done())
        .catch(done);
    });

    it('should handle additions', done => {
      sinon
        .stub(watchesService, 'getWatches')
        .callsFake((userId, entityType) => {
          expect(userId).to.eql('1234');
          expect(entityType).to.eql('talent');

          return Promise.resolve({
            version: 1,
            items: [{ id: 'watch-1' }],
          });
        });

      sinon
        .stub(watchRepository, 'createOrUpdateWatches')
        .callsFake((currentVersion, newVersion, userId, entityType, items) => {
          expect(currentVersion).to.eql(1);
          expect(newVersion).to.eql(2);
          expect(userId).to.eql('1234');
          expect(entityType).to.eql('talent');
          expect(items).to.eql([
            { id: 'watch-1' },
            {
              id: 'watch-2',
              label: 'foo',
              created: 99,
            },
          ]);

          return Promise.resolve();
        });

      userService
        .updateWatches({
          newVersion: 2,
          userId: '1234',
          entityType: 'talent',
          changes: [
            {
              changeType: constants.WATCH_CHANGE_TYPE_ADD,
              id: 'watch-2',
              label: 'foo',
              created: 99,
            },
          ],
        })
        .then(() => done())
        .catch(done);
    });
  });
});
