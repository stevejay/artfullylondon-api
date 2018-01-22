'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const dynamoDbClient = require('dynamodb-doc-client-wrapper');
const preferenceRepository = require('../../lib/persistence/preference-repository');

process.env.SERVERLESS_PREFERENCES_TABLE_NAME = 'preferences-table';

describe('preference-repository', () => {
  describe('deletePreferencesForUser', () => {
    afterEach(() => {
      dynamoDbClient.delete.restore && dynamoDbClient.delete.restore();
    });

    it('should handle a valid request', done => {
      sinon.stub(dynamoDbClient, 'delete').callsFake(param => {
        expect(param).to.eql({
          TableName: process.env.SERVERLESS_PREFERENCES_TABLE_NAME,
          Key: { userId: '1234' },
          ReturnConsumedCapacity: undefined,
        });

        return Promise.resolve();
      });

      preferenceRepository
        .deletePreferencesForUser('1234')
        .then(() => done())
        .catch(done);
    });
  });

  describe('tryGetPreferencesForUser', () => {
    afterEach(() => {
      dynamoDbClient.tryGet.restore && dynamoDbClient.tryGet.restore();
    });

    it('should get existing preferences', done => {
      sinon.stub(dynamoDbClient, 'tryGet').callsFake(param => {
        expect(param).to.eql({
          TableName: process.env.SERVERLESS_PREFERENCES_TABLE_NAME,
          Key: { userId: '1234' },
          ProjectionExpression: 'emailFrequency',
          ReturnConsumedCapacity: undefined,
        });

        return Promise.resolve({ emailFrequency: 2 });
      });

      preferenceRepository
        .tryGetPreferencesForUser('1234')
        .then(response => {
          expect(response).to.eql({ emailFrequency: 2 });
          done();
        })
        .catch(done);
    });

    it('should handle no existing preferences', done => {
      sinon.stub(dynamoDbClient, 'tryGet').callsFake(param => {
        expect(param).to.eql({
          TableName: process.env.SERVERLESS_PREFERENCES_TABLE_NAME,
          Key: { userId: '1234' },
          ProjectionExpression: 'emailFrequency',
          ReturnConsumedCapacity: undefined,
        });

        return Promise.resolve(null);
      });

      preferenceRepository
        .tryGetPreferencesForUser('1234')
        .then(response => {
          expect(response).to.eql(null);
          done();
        })
        .catch(done);
    });
  });

  describe('updatePreferencesForUser', () => {
    afterEach(() => {
      dynamoDbClient.put.restore && dynamoDbClient.put.restore();
    });

    it('should handle a valid request', done => {
      sinon.stub(dynamoDbClient, 'put').callsFake(param => {
        expect(param).to.eql({
          TableName: process.env.SERVERLESS_PREFERENCES_TABLE_NAME,
          Key: { userId: '1234' },
          Item: { emailFrequency: 2 },
          ReturnConsumedCapacity: undefined,
        });

        return Promise.resolve();
      });

      preferenceRepository
        .updatePreferencesForUser('1234', { emailFrequency: 2 })
        .then(() => done())
        .catch(done);
    });
  });
});
