'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const dynamoDbClient = require('dynamodb-doc-client-wrapper');
const watchRepository = require('../../lib/persistence/watch-repository');

process.env.SERVERLESS_WATCH_TABLE_NAME = 'watch-table';

describe('watch-repository', () => {
  describe('tryGetWatchesByTypeForUser', () => {
    afterEach(() => {
      dynamoDbClient.tryGet.restore && dynamoDbClient.tryGet.restore();
    });

    it('should handle a valid request', done => {
      sinon.stub(dynamoDbClient, 'tryGet').callsFake(param => {
        expect(param).to.eql({
          TableName: process.env.SERVERLESS_WATCH_TABLE_NAME,
          Key: { userId: '1234', entityType: 'talent' },
          ProjectionExpression: 'version, #items',
          ExpressionAttributeNames: { '#items': 'items' },
          ReturnConsumedCapacity: undefined,
        });

        return Promise.resolve({ id: 'foo' });
      });

      watchRepository
        .tryGetWatchesByTypeForUser('1234', 'talent')
        .then(response => {
          expect(response).to.eql({ id: 'foo' });
          done();
        })
        .catch(done);
    });
  });

  describe('getAllWatchesForUser', () => {
    afterEach(() => {
      dynamoDbClient.query.restore && dynamoDbClient.query.restore();
    });

    it('should handle a valid request', done => {
      sinon.stub(dynamoDbClient, 'query').callsFake(param => {
        expect(param).to.eql({
          TableName: process.env.SERVERLESS_WATCH_TABLE_NAME,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: { ':userId': '1234' },
          ProjectionExpression: 'entityType, version, #items',
          ExpressionAttributeNames: { '#items': 'items' },
          ReturnConsumedCapacity: undefined,
        });

        return Promise.resolve([{ id: 'foo' }]);
      });

      watchRepository
        .getAllWatchesForUser('1234')
        .then(response => {
          expect(response).to.eql([{ id: 'foo' }]);
          done();
        })
        .catch(done);
    });
  });

  describe('deleteWatchesForUser', () => {
    afterEach(() => {
      dynamoDbClient.batchWriteBasic.restore &&
        dynamoDbClient.batchWriteBasic.restore();
    });

    it('should handle a valid request', done => {
      sinon.stub(dynamoDbClient, 'batchWriteBasic').callsFake(param => {
        expect(param).to.eql({
          RequestItems: {
            [process.env.SERVERLESS_WATCH_TABLE_NAME]: [
              {
                DeleteRequest: {
                  Key: { userId: '1234', entityType: 'talent' },
                },
              },
            ],
          },
        });

        return Promise.resolve();
      });

      watchRepository
        .deleteWatchesForUser([
          {
            DeleteRequest: {
              Key: { userId: '1234', entityType: 'talent' },
            },
          },
        ])
        .then(() => done())
        .catch(done);
    });
  });

  describe('createOrUpdateWatches', () => {
    afterEach(() => {
      dynamoDbClient.put.restore && dynamoDbClient.put.restore();
    });

    it('should handle creating the initial version', done => {
      sinon.stub(dynamoDbClient, 'put').callsFake(param => {
        expect(param).to.eql({
          TableName: process.env.SERVERLESS_WATCH_TABLE_NAME,
          Item: {
            userId: '1234',
            entityType: 'talent',
            version: 1,
            items: [{ foo: 'bar' }],
          },
          ConditionExpression:
            'attribute_not_exists(userId) and attribute_not_exists(entityType)',
          ReturnConsumedCapacity: undefined,
        });

        return Promise.resolve();
      });

      watchRepository
        .createOrUpdateWatches(0, 1, '1234', 'talent', [{ foo: 'bar' }])
        .then(() => done())
        .catch(done);
    });
  });

  describe('createOrUpdateWatches', () => {
    afterEach(() => {
      dynamoDbClient.put.restore && dynamoDbClient.put.restore();
    });

    it('should handle updating an existing entity', done => {
      sinon.stub(dynamoDbClient, 'put').callsFake(param => {
        expect(param).to.eql({
          TableName: process.env.SERVERLESS_WATCH_TABLE_NAME,
          Item: {
            userId: '1234',
            entityType: 'talent',
            version: 2,
            items: [{ foo: 'bar' }],
          },
          ConditionExpression:
            'attribute_exists(userId) and attribute_exists(entityType) and version = :oldVersion',
          ExpressionAttributeValues: { ':oldVersion': 1 },
          ReturnConsumedCapacity: undefined,
        });

        return Promise.resolve();
      });

      watchRepository
        .createOrUpdateWatches(1, 2, '1234', 'talent', [{ foo: 'bar' }])
        .then(() => done())
        .catch(done);
    });
  });
});
