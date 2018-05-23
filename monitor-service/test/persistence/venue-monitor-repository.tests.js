'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const dynamoDbClient = require('dynamodb-doc-client-wrapper');
const venueMonitorRepository = require('../../lib/persistence/venue-monitor-repository');

process.env.SERVERLESS_VENUE_MONITOR_TABLE_NAME = 'VenueMonitorTable';

describe('venue-monitor-repository', () => {
  describe('get', () => {
    afterEach(() => {
      dynamoDbClient.get.restore && dynamoDbClient.get.restore();
    });

    it('should get a venue monitor', done => {
      sinon.stub(dynamoDbClient, 'get').callsFake(params => {
        expect(params).toEqual({
          TableName: process.env.SERVERLESS_VENUE_MONITOR_TABLE_NAME,
          Key: { venueId: 'almeida-theatre' },
          ReturnConsumedCapacity: undefined,
        });

        return Promise.resolve({ id: 'some-id' });
      });

      venueMonitorRepository
        .get('almeida-theatre')
        .then(response => {
          expect(response).toEqual({ id: 'some-id' });
          done();
        })
        .catch(done);
    });
  });

  describe('tryGet', () => {
    afterEach(() => {
      dynamoDbClient.tryGet.restore && dynamoDbClient.tryGet.restore();
    });

    it('should try to get a venue monitor', done => {
      sinon.stub(dynamoDbClient, 'tryGet').callsFake(params => {
        expect(params).toEqual({
          TableName: process.env.SERVERLESS_VENUE_MONITOR_TABLE_NAME,
          Key: { venueId: 'almeida-theatre' },
          ReturnConsumedCapacity: undefined,
        });

        return Promise.resolve({ id: 'some-id' });
      });

      venueMonitorRepository
        .tryGet('almeida-theatre')
        .then(response => {
          expect(response).toEqual({ id: 'some-id' });
          done();
        })
        .catch(done);
    });
  });

  describe('update', () => {
    afterEach(() => {
      dynamoDbClient.update.restore && dynamoDbClient.update.restore();
    });

    it('should update a venue monitor', done => {
      sinon.stub(dynamoDbClient, 'update').callsFake(params => {
        expect(params).toEqual({
          TableName: process.env.SERVERLESS_VENUE_MONITOR_TABLE_NAME,
          Key: { venueId: 'almeida-theatre' },
          UpdateExpression: 'set isIgnored = :isIgnored, hasChanged = :hasChanged',
          ConditionExpression: 'attribute_exists(venueId)',
          ExpressionAttributeValues: {
            ':isIgnored': true,
            ':hasChanged': false,
          },
          ReturnConsumedCapacity: undefined,
        });

        return Promise.resolve();
      });

      venueMonitorRepository
        .update({
          venueId: 'almeida-theatre',
          isIgnored: true,
          hasChanged: false,
        })
        .then(() => done())
        .catch(done);
    });
  });

  describe('put', () => {
    afterEach(() => {
      dynamoDbClient.put.restore && dynamoDbClient.put.restore();
    });

    it('should put a venue monitor', done => {
      sinon.stub(dynamoDbClient, 'put').callsFake(params => {
        expect(params).toEqual({
          TableName: process.env.SERVERLESS_VENUE_MONITOR_TABLE_NAME,
          Item: {
            venueId: 'almeida-theatre',
            isIgnored: true,
            hasChanged: false,
          },
          ReturnConsumedCapacity: undefined,
        });

        return Promise.resolve();
      });

      venueMonitorRepository
        .put({
          venueId: 'almeida-theatre',
          isIgnored: true,
          hasChanged: false,
        })
        .then(() => done())
        .catch(done);
    });
  });

  describe('getChanged', () => {
    afterEach(() => {
      dynamoDbClient.scan.restore && dynamoDbClient.scan.restore();
    });

    it('should get changed venue monitors', done => {
      sinon.stub(dynamoDbClient, 'scan').callsFake(params => {
        expect(params).toEqual({
          TableName: process.env.SERVERLESS_VENUE_MONITOR_TABLE_NAME,
          FilterExpression: 'isIgnored = :isIgnored AND hasChanged = :hasChanged',
          ExpressionAttributeValues: {
            ':isIgnored': false,
            ':hasChanged': true,
          },
          ProjectionExpression: 'venueId',
          ReturnConsumedCapacity: undefined,
        });

        return Promise.resolve([{ id: 'some-id' }]);
      });

      venueMonitorRepository
        .getChanged()
        .then(response => {
          expect(response).toEqual([{ id: 'some-id' }]);
          done();
        })
        .catch(done);
    });
  });
});
