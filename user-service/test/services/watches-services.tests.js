'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const watches = require('../../lib/services/watches-service');
const constants = require('../../lib/constants');
const watchRepository = require('../../lib/persistence/watch-repository');

const USER_ID = 'email|12345';

describe('watches', () => {
  describe('deleteAllWatches', () => {
    afterEach(() => {
      watchRepository.deleteWatchesForUser.restore &&
        watchRepository.deleteWatchesForUser.restore();
    });

    it('should delete preferences', done => {
      sinon
        .stub(watchRepository, 'deleteWatchesForUser')
        .callsFake(deleteRequests => {
          expect(deleteRequests).to.eql([
            {
              DeleteRequest: {
                Key: { userId: USER_ID, entityType: 'tag' },
              },
            },
            {
              DeleteRequest: {
                Key: { userId: USER_ID, entityType: 'talent' },
              },
            },
            {
              DeleteRequest: {
                Key: { userId: USER_ID, entityType: 'venue' },
              },
            },
            {
              DeleteRequest: {
                Key: { userId: USER_ID, entityType: 'event' },
              },
            },
            {
              DeleteRequest: {
                Key: { userId: USER_ID, entityType: 'event-series' },
              },
            },
          ]);

          return Promise.resolve();
        });

      watches.deleteAllWatches(USER_ID).then(() => done()).catch(done);
    });
  });

  describe('getAllWatches', () => {
    afterEach(() => {
      watchRepository.getAllWatchesForUser.restore &&
        watchRepository.getAllWatchesForUser.restore();
    });

    it('should return empty watches data when watches do not exist', done => {
      sinon.stub(watchRepository, 'getAllWatchesForUser').callsFake(userId => {
        expect(userId).to.eql(USER_ID);
        return Promise.resolve([]);
      });

      const expected = [
        {
          entityType: constants.ENTITY_TYPE_TAG,
          version: constants.INITIAL_VERSION_NUMBER,
          items: [],
        },
        {
          entityType: constants.ENTITY_TYPE_TALENT,
          version: constants.INITIAL_VERSION_NUMBER,
          items: [],
        },
        {
          entityType: constants.ENTITY_TYPE_VENUE,
          version: constants.INITIAL_VERSION_NUMBER,
          items: [],
        },
        {
          entityType: constants.ENTITY_TYPE_EVENT,
          version: constants.INITIAL_VERSION_NUMBER,
          items: [],
        },
        {
          entityType: constants.ENTITY_TYPE_EVENT_SERIES,
          version: constants.INITIAL_VERSION_NUMBER,
          items: [],
        },
      ];

      watches
        .getAllWatches(USER_ID)
        .then(response => {
          expect(response).to.eql(expected);
          done();
        })
        .catch(done);
    });

    it('should return all watches data when some watches exist', done => {
      sinon.stub(watchRepository, 'getAllWatchesForUser').callsFake(userId => {
        expect(userId).to.eql(USER_ID);

        return Promise.resolve([
          {
            entityType: constants.ENTITY_TYPE_TALENT,
            version: 9,
            items: [
              {
                id: 'talent/carrie-cracknell-director',
                label: 'Carrie Cracknell',
                created: 700,
              },
            ],
          },
        ]);
      });

      const expected = [
        {
          entityType: constants.ENTITY_TYPE_TALENT,
          version: 9,
          items: [
            {
              id: 'talent/carrie-cracknell-director',
              label: 'Carrie Cracknell',
              created: 700,
            },
          ],
        },
        {
          entityType: constants.ENTITY_TYPE_TAG,
          version: constants.INITIAL_VERSION_NUMBER,
          items: [],
        },
        {
          entityType: constants.ENTITY_TYPE_VENUE,
          version: constants.INITIAL_VERSION_NUMBER,
          items: [],
        },
        {
          entityType: constants.ENTITY_TYPE_EVENT,
          version: constants.INITIAL_VERSION_NUMBER,
          items: [],
        },
        {
          entityType: constants.ENTITY_TYPE_EVENT_SERIES,
          version: constants.INITIAL_VERSION_NUMBER,
          items: [],
        },
      ];

      watches
        .getAllWatches(USER_ID)
        .then(response => {
          expect(response).to.eql(expected);
          done();
        })
        .catch(done);
    });
  });

  describe('getWatches', () => {
    afterEach(() => {
      watchRepository.tryGetWatchesByTypeForUser.restore &&
        watchRepository.tryGetWatchesByTypeForUser.restore();
    });

    it('should return empty watches data when watches do not exist', done => {
      sinon
        .stub(watchRepository, 'tryGetWatchesByTypeForUser')
        .callsFake((userId, entityType) => {
          expect(userId).to.eql(USER_ID);
          expect(entityType).to.eql('talent');

          return Promise.resolve();
        });

      const expected = {
        entityType: constants.ENTITY_TYPE_TALENT,
        version: constants.INITIAL_VERSION_NUMBER,
        items: [],
      };

      watches
        .getWatches(USER_ID, 'talent')
        .then(response => {
          expect(response).to.eql(expected);
          done();
        })
        .catch(done);
    });

    it('should return all watches data when some watches exist', done => {
      sinon
        .stub(watchRepository, 'tryGetWatchesByTypeForUser')
        .callsFake((userId, entityType) => {
          expect(userId).to.eql(USER_ID);
          expect(entityType).to.eql('talent');

          return Promise.resolve({
            entityType: constants.ENTITY_TYPE_TALENT,
            version: 9,
            items: [
              {
                id: 'talent/carrie-cracknell-director',
                label: 'Carrie Cracknell',
                created: 700,
              },
            ],
          });
        });

      const expected = {
        entityType: constants.ENTITY_TYPE_TALENT,
        version: 9,
        items: [
          {
            id: 'talent/carrie-cracknell-director',
            label: 'Carrie Cracknell',
            created: 700,
          },
        ],
      };

      watches
        .getWatches(USER_ID, 'talent')
        .then(response => {
          expect(response).to.eql(expected);
          done();
        })
        .catch(done);
    });
  });
});
