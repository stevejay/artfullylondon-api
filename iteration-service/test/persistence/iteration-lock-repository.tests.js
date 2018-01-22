'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const dynamoDbClient = require('dynamodb-doc-client-wrapper');
const iterationLockRepository = require('../../lib/persistence/iteration-lock-repository');

process.env.SERVERLESS_ITERATON_LOCK_TABLE_NAME = 'IterationLock';

describe('iteration-lock-repository', () => {
  describe('deleteLock', () => {
    afterEach(() => {
      dynamoDbClient.delete.restore && dynamoDbClient.delete.restore();
    });

    it('should delete a lock', done => {
      sinon.stub(dynamoDbClient, 'delete').callsFake(param => {
        expect(param).to.eql({
          TableName: process.env.SERVERLESS_ITERATON_LOCK_TABLE_NAME,
          Key: { actionId: 'some-action-id' },
          ReturnConsumedCapacity: undefined,
        });

        return Promise.resolve();
      });

      iterationLockRepository
        .deleteLock('some-action-id')
        .then(() => done())
        .catch(done);
    });
  });

  describe('addLock', () => {
    afterEach(() => {
      dynamoDbClient.put.restore && dynamoDbClient.put.restore();
    });

    it('should add a lock', done => {
      sinon.stub(dynamoDbClient, 'put').callsFake(param => {
        expect(param).to.eql({
          TableName: process.env.SERVERLESS_ITERATON_LOCK_TABLE_NAME,
          Item: { actionId: 'some-action-id' },
          ConditionExpression: 'attribute_not_exists(actionId)',
          ReturnConsumedCapacity: undefined,
        });

        return Promise.resolve();
      });

      iterationLockRepository
        .addLock({ actionId: 'some-action-id' })
        .then(() => done())
        .catch(done);
    });
  });
});
