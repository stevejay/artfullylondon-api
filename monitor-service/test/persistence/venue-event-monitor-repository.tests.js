'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const dynamoDbClient = require('dynamodb-doc-client-wrapper');
const venueEventMonitorRepository = require('../../lib/persistence/venue-event-monitor-repository');

process.env.SERVERLESS_EVENT_MONITOR_TABLE_NAME = 'VenueEventMonitorTable';

describe('venue-event-monitor-repository', () => {
  describe('tryGet', () => {
    afterEach(() => {
      dynamoDbClient.tryGet.restore && dynamoDbClient.tryGet.restore();
    });

    it('should get a venue event monitor', done => {
      sinon.stub(dynamoDbClient, 'tryGet').callsFake(params => {
        expect(params).to.eql({
          TableName: process.env.SERVERLESS_EVENT_MONITOR_TABLE_NAME,
          Key: { venueId: 'almeida-theatre', externalEventId: 'external-id' },
          ReturnConsumedCapacity: undefined,
        });

        return Promise.resolve({ id: 'some-id' });
      });

      venueEventMonitorRepository
        .tryGet('almeida-theatre', 'external-id')
        .then(response => {
          expect(response).to.eql({ id: 'some-id' });
          done();
        })
        .catch(done);
    });
  });

  describe('getAllForVenue', () => {
    afterEach(() => {
      dynamoDbClient.query.restore && dynamoDbClient.query.restore();
    });

    it('should get all venue event monitors for a venue', done => {
      sinon.stub(dynamoDbClient, 'query').callsFake(params => {
        expect(params).to.eql({
          TableName: process.env.SERVERLESS_EVENT_MONITOR_TABLE_NAME,
          KeyConditionExpression: 'venueId = :venueId',
          ExpressionAttributeValues: { ':venueId': 'almeida-theatre' },
          ProjectionExpression:
            'venueId, externalEventId, currentUrl, ' +
            'title, isIgnored, inArtfully, hasChanged, combinedEvents',
          ReturnConsumedCapacity: undefined,
        });

        return Promise.resolve([{ id: 'some-id' }]);
      });

      venueEventMonitorRepository
        .getAllForVenue('almeida-theatre')
        .then(response => {
          expect(response).to.eql([{ id: 'some-id' }]);
          done();
        })
        .catch(done);
    });
  });

  describe('update', () => {
    afterEach(() => {
      dynamoDbClient.update.restore && dynamoDbClient.update.restore();
    });

    it('should update a venue event monitor', done => {
      sinon.stub(dynamoDbClient, 'update').callsFake(params => {
        expect(params).to.eql({
          TableName: process.env.SERVERLESS_EVENT_MONITOR_TABLE_NAME,
          Key: {
            venueId: 'almeida-theatre',
            externalEventId: 'some-external-id',
          },
          UpdateExpression:
            'SET isIgnored = :isIgnored, hasChanged = :hasChanged REMOVE oldEventText',
          ConditionExpression:
            'attribute_exists(venueId) and attribute_exists(externalEventId)',
          ExpressionAttributeValues: {
            ':isIgnored': true,
            ':hasChanged': false,
          },
          ReturnConsumedCapacity: undefined,
        });

        return Promise.resolve();
      });

      venueEventMonitorRepository
        .update({
          venueId: 'almeida-theatre',
          externalEventId: 'some-external-id',
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

    it('should handle putting an entity', done => {
      const putStub = sinon.stub(dynamoDbClient, 'put').callsFake(params => {
        expect(params).to.eql({
          TableName: process.env.SERVERLESS_EVENT_MONITOR_TABLE_NAME,
          Item: { id: 'some-id' },
          ReturnConsumedCapacity: undefined,
        });

        return Promise.resolve();
      });

      venueEventMonitorRepository
        .put({ id: 'some-id' })
        .then(() => {
          expect(putStub.called).to.eql(true);
          done();
        })
        .catch(done);
    });
  });

  describe('getNewOrChanged', () => {
    afterEach(() => {
      dynamoDbClient.scan.restore && dynamoDbClient.scan.restore();
    });

    it('should handle a valid request', done => {
      sinon.stub(dynamoDbClient, 'scan').callsFake(params => {
        expect(params).to.eql({
          TableName: process.env.SERVERLESS_EVENT_MONITOR_TABLE_NAME,
          FilterExpression:
            'isIgnored = :false AND ' +
            '((inArtfully = :false AND combinedEvents = :false) OR hasChanged = :true)',
          ExpressionAttributeValues: {
            ':false': false,
            ':true': true,
          },
          ProjectionExpression: 'venueId',
          ReturnConsumedCapacity: undefined,
        });

        return Promise.resolve([{ id: 'some-id' }]);
      });

      venueEventMonitorRepository
        .getNewOrChanged()
        .then(response => {
          expect(response).to.eql([{ id: 'some-id' }]);
          done();
        })
        .catch(done);
    });
  });
});
