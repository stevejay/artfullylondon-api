'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const dynamoDbClient = require('dynamodb-doc-client-wrapper');
const iterationErrorRepository = require('../../lib/persistence/iteration-error-repository');

process.env.SERVERLESS_ITERATON_ERROR_TABLE_NAME = 'IterationError';

describe('iteration-error-repository', () => {
  describe('saveError', () => {
    afterEach(() => {
      dynamoDbClient.put.restore && dynamoDbClient.put.restore();
    });

    it('should save an error', done => {
      sinon.stub(dynamoDbClient, 'put').callsFake(param => {
        expect(param).toEqual({
          TableName: process.env.SERVERLESS_ITERATON_ERROR_TABLE_NAME,
          Item: { error: 'Some error' },
          ReturnConsumedCapacity: undefined,
        });

        return Promise.resolve();
      });

      iterationErrorRepository
        .saveError({ error: 'Some error' })
        .then(() => done())
        .catch(done);
    });
  });

  describe('getErrorsForIteration', () => {
    afterEach(() => {
      dynamoDbClient.query.restore && dynamoDbClient.query.restore();
    });

    it('should get iteration errors', done => {
      sinon.stub(dynamoDbClient, 'query').callsFake(param => {
        expect(param).toEqual({
          TableName: process.env.SERVERLESS_ITERATON_ERROR_TABLE_NAME,
          KeyConditionExpression: 'actionIdStartTimestamp = :actionIdStartTimestamp',
          ExpressionAttributeValues: {
            ':actionIdStartTimestamp': 'some-key',
          },
          ProjectionExpression: 'entityId, message',
          ReturnConsumedCapacity: undefined,
        });

        return Promise.resolve([{ id: 'some-id' }]);
      });

      iterationErrorRepository
        .getErrorsForIteration('some-key')
        .then(response => {
          expect(response).toEqual([{ id: 'some-id' }]);
          done();
        })
        .catch(done);
    });
  });
});
