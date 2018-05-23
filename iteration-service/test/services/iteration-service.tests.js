'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const iterationService = require('../../lib/services/iteration-service');
const iterationErrorRepository = require('../../lib/persistence/iteration-error-repository');
const iterationLockRepository = require('../../lib/persistence/iteration-lock-repository');
const iterationRepository = require('../../lib/persistence/iteration-repository');

describe('iteration-service', () => {
  describe('addIterationError', () => {
    afterEach(() => {
      iterationErrorRepository.saveError.restore &&
        iterationErrorRepository.saveError.restore();
    });

    it('should add an iteration error', done => {
      sinon.stub(iterationErrorRepository, 'saveError').callsFake(params => {
        expect(params).toEqual({
          actionIdStartTimestamp: 'some-action-id_12345678',
          entityId: 'some-entity-id',
          message: 'Some message',
        });

        return Promise.resolve();
      });

      iterationService
        .addIterationError(
          'some-action-id',
          12345678,
          'some-entity-id',
          'Some message'
        )
        .then(() => done())
        .catch(done);
    });
  });

  describe('endIteration', () => {
    afterEach(() => {
      iterationLockRepository.deleteLock.restore &&
        iterationLockRepository.deleteLock.restore();

      iterationRepository.setIterationEndTimestamp.restore &&
        iterationRepository.setIterationEndTimestamp.restore();
    });

    it('should end an iteration', done => {
      sinon.stub(iterationLockRepository, 'deleteLock').callsFake(actionId => {
        expect(actionId).toEqual('some-action-id');
        return Promise.resolve();
      });

      sinon
        .stub(iterationRepository, 'setIterationEndTimestamp')
        .callsFake((actionId, startTimestamp) => {
          expect(actionId).toEqual('some-action-id');
          expect(startTimestamp).toEqual(12345678);
          return Promise.resolve();
        });

      iterationService
        .endIteration('some-action-id', 12345678)
        .then(() => done())
        .catch(done);
    });
  });

  describe('startIteration', () => {
    afterEach(() => {
      iterationLockRepository.addLock.restore &&
        iterationLockRepository.addLock.restore();

      iterationRepository.addIteration.restore &&
        iterationRepository.addIteration.restore();
    });

    it('should start an iteration', done => {
      sinon.stub(iterationLockRepository, 'addLock').callsFake(item => {
        expect(item.actionId).toEqual('some-action-id');
        expect(item.startTimestamp).to.be.greaterThan(0);
        return Promise.resolve();
      });

      sinon.stub(iterationRepository, 'addIteration').callsFake(item => {
        expect(item.actionId).toEqual('some-action-id');
        expect(item.startTimestamp).to.be.greaterThan(0);
        return Promise.resolve();
      });

      iterationService
        .startIteration('some-action-id')
        .then(response => {
          expect(response.actionId).toEqual('some-action-id');
          expect(response.startTimestamp).to.be.greaterThan(0);
          done();
        })
        .catch(done);
    });
  });

  describe('getLatestIterationErrors', () => {
    afterEach(() => {
      iterationRepository.getMostRecentIteration.restore &&
        iterationRepository.getMostRecentIteration.restore();

      iterationErrorRepository.getErrorsForIteration.restore &&
        iterationErrorRepository.getErrorsForIteration.restore();
    });

    it('should get the latest iteration errors when there are errors', done => {
      sinon
        .stub(iterationRepository, 'getMostRecentIteration')
        .callsFake(actionId => {
          expect(actionId).toEqual('some-action-id');
          return Promise.resolve({ Items: [{ startTimestamp: 12345678 }] });
        });

      sinon
        .stub(iterationErrorRepository, 'getErrorsForIteration')
        .callsFake(key => {
          expect(key).toEqual('some-action-id_12345678');
          return Promise.resolve([{ id: 'some-id' }]);
        });

      iterationService
        .getLatestIterationErrors('some-action-id')
        .then(response => {
          expect(response).toEqual([{ id: 'some-id' }]);
          done();
        })
        .catch(done);
    });

    it('should get the latest iteration errors when there are no errors', done => {
      sinon
        .stub(iterationRepository, 'getMostRecentIteration')
        .callsFake(actionId => {
          expect(actionId).toEqual('some-action-id');
          return Promise.resolve({ Items: [{ startTimestamp: 12345678 }] });
        });

      sinon
        .stub(iterationErrorRepository, 'getErrorsForIteration')
        .callsFake(key => {
          expect(key).toEqual('some-action-id_12345678');
          return Promise.resolve([]);
        });

      iterationService
        .getLatestIterationErrors('some-action-id')
        .then(response => {
          expect(response).toEqual([]);
          done();
        })
        .catch(done);
    });

    it('should handle not finding a most recent iteration', done => {
      sinon
        .stub(iterationRepository, 'getMostRecentIteration')
        .callsFake(actionId => {
          expect(actionId).toEqual('some-action-id');
          return Promise.resolve({ Items: [] });
        });

      iterationService
        .getLatestIterationErrors('some-action-id')
        .then(response => {
          expect(response).toEqual([]);
          done();
        })
        .catch(done);
    });
  });
});
