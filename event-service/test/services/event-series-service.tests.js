'use strict';

const sinon = require('sinon');
const chai = require('chai');
chai.use(require('chai-subset'));
const expect = chai.expect;
const dynamoDbClient = require('dynamodb-doc-client-wrapper');
const testData = require('../test-data');
const eventSeriesService = require('../../lib/services/event-series-service');
const eventSeriesConstants = require('../../lib/event-series/constants');
const elasticsearch = require('../../lib/external-services/elasticsearch');
const eventMessaging = require('../../lib/event/messaging');
const etag = require('../../lib/lambda/etag');
const globalConstants = require('../../lib/constants');

process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME = 'event-series-table';
process.env.SERVERLESS_EVENT_TABLE_NAME = 'event-table';
process.env.SERVERLESS_EVENT_BY_EVENT_SERIES_INDEX_NAME = 'event-by-event-series';

describe('createOrUpdateEventSeries', () => {
  afterEach(() => {
    if (dynamoDbClient.query.restore) {
      dynamoDbClient.query.restore();
    }
    if (dynamoDbClient.put.restore) {
      dynamoDbClient.put.restore();
    }
    if (elasticsearch.bulk.restore) {
      elasticsearch.bulk.restore();
    }
    if (etag.writeETagToRedis.restore) {
      etag.writeETagToRedis.restore();
    }

    if (eventMessaging.notifyEventsForEventSeries.restore) {
      eventMessaging.notifyEventsForEventSeries.restore();
    }
  });

  it('should throw an exception when request is invalid', done => {
    eventSeriesService
      .createOrUpdateEventSeries(null, {
        status: 'Foo',
      })
      .then(() => done(new Error('should have thrown exception')))
      .catch(() => done());
  });

  it('should process create event series request', done => {
    sinon.stub(dynamoDbClient, 'query').callsFake(params => {
      expect(params).to.eql({
        TableName: process.env.SERVERLESS_EVENT_TABLE_NAME,
        IndexName: process.env.SERVERLESS_EVENT_BY_EVENT_SERIES_INDEX_NAME,
        KeyConditionExpression: 'eventSeriesId = :id',
        ExpressionAttributeValues: { ':id': testData.EVENT_SERIES_ID },
        ProjectionExpression: 'id',
        ReturnConsumedCapacity: undefined,
      });

      return Promise.resolve([{ id: testData.PERFORMANCE_EVENT_ID }]);
    });

    sinon.stub(dynamoDbClient, 'put').callsFake(params => {
      expect(params).to.eql({
        TableName: process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME,
        Item: {
          id: testData.EVENT_SERIES_ID,
          name: 'Bang Said The Gun',
          status: 'Active',
          eventSeriesType: 'Occasional',
          occurrence: 'Third Thursday of each month',
          summary: 'A poetry riot',
          description: 'Poetry for people who dont like poetry.',
          version: 1,
          schemeVersion: eventSeriesConstants.CURRENT_EVENT_SERIES_SCHEME_VERSION,
          createdDate: '2016/01/10',
          updatedDate: '2016/01/11',
        },
        ConditionExpression: 'attribute_not_exists(id)',
        ReturnConsumedCapacity: undefined,
      });

      return Promise.resolve();
    });

    sinon.stub(eventMessaging, 'notifyEventsForEventSeries').callsFake(() => {
      return Promise.reject(
        new Error('notifyEventsForEventSeries should not have been invoked')
      );
    });

    sinon.stub(elasticsearch, 'bulk').callsFake(params => {
      expect(params).to.eql({
        body: [
          {
            index: {
              _index: globalConstants.SEARCH_INDEX_TYPE_EVENT_SERIES_FULL,
              _type: 'default',
              _id: testData.EVENT_SERIES_ID,
              _version: 1,
              _version_type: 'external',
            },
          },
          {
            entityType: 'event-series',
            id: testData.EVENT_SERIES_ID,
            name: 'Bang Said The Gun',
            name_sort: 'bang said the gun',
            status: 'Active',
            eventSeriesType: 'Occasional',
            occurrence: 'Third Thursday of each month',
            summary: 'A poetry riot',
            version: 1,
          },
          {
            index: {
              _index: globalConstants.SEARCH_INDEX_TYPE_EVENT_SERIES_AUTO,
              _type: 'default',
              _id: testData.EVENT_SERIES_ID,
              _version: 1,
              _version_type: 'external',
            },
          },
          {
            nameSuggest: ['bang said the gun'],
            output: 'Bang Said The Gun (Event Series)',
            id: testData.EVENT_SERIES_ID,
            status: 'Active',
            entityType: 'event-series',
            version: 1,
          },
          {
            index: {
              _index: globalConstants.SEARCH_INDEX_TYPE_COMBINED_EVENT_AUTO,
              _type: 'default',
              _id: testData.EVENT_SERIES_ID,
              _version: 1,
              _version_type: 'external',
            },
          },
          {
            nameSuggest: ['bang said the gun'],
            output: 'Bang Said The Gun (Event Series)',
            id: testData.EVENT_SERIES_ID,
            status: 'Active',
            entityType: 'event-series',
            version: 1,
          },
        ],
      });

      return Promise.resolve();
    });

    sinon.stub(etag, 'writeETagToRedis').callsFake(key => {
      expect(key).to.eql('event-series/' + testData.EVENT_SERIES_ID);
      return Promise.resolve();
    });

    const expected = {
      id: testData.EVENT_SERIES_ID,
      name: 'Bang Said The Gun',
      status: 'Active',
      eventSeriesType: 'Occasional',
      occurrence: 'Third Thursday of each month',
      summary: 'A poetry riot',
      description: 'Poetry for people who dont like poetry.',
      version: 1,
      schemeVersion: eventSeriesConstants.CURRENT_EVENT_SERIES_SCHEME_VERSION,
      createdDate: '2016/01/10',
      updatedDate: '2016/01/11',
    };

    eventSeriesService
      .createOrUpdateEventSeries(null, {
        name: 'Bang Said The Gun',
        status: 'Active',
        eventSeriesType: 'Occasional',
        occurrence: 'Third Thursday of each month',
        summary: 'A poetry riot',
        description: 'Poetry for people who dont like poetry.',
        version: 1,
        createdDate: '2016/01/10',
        updatedDate: '2016/01/11',
      })
      .then(response => expect(response).to.eql(expected))
      .then(() => done())
      .catch(done);
  });

  it('should process update event series request', done => {
    sinon.stub(dynamoDbClient, 'query').callsFake(params => {
      expect(params).to.eql({
        TableName: process.env.SERVERLESS_EVENT_TABLE_NAME,
        IndexName: process.env.SERVERLESS_EVENT_BY_EVENT_SERIES_INDEX_NAME,
        KeyConditionExpression: 'eventSeriesId = :id',
        ExpressionAttributeValues: { ':id': testData.EVENT_SERIES_ID },
        ProjectionExpression: 'id',
        ReturnConsumedCapacity: undefined,
      });

      return Promise.resolve([]);
    });

    sinon.stub(dynamoDbClient, 'put').callsFake(params => {
      expect(params).to.eql({
        TableName: process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME,
        Item: {
          id: testData.EVENT_SERIES_ID,
          name: 'Bang Said The Gun',
          status: 'Active',
          eventSeriesType: 'Occasional',
          occurrence: 'Third Thursday of each month',
          summary: 'A poetry riot',
          description: 'Poetry for people who dont like poetry.',
          version: 5,
          schemeVersion: eventSeriesConstants.CURRENT_EVENT_SERIES_SCHEME_VERSION,
          createdDate: '2016/01/10',
          updatedDate: '2016/01/11',
        },
        ConditionExpression: 'attribute_exists(id) and version = :oldVersion',
        ExpressionAttributeValues: { ':oldVersion': 4 },
        ReturnConsumedCapacity: undefined,
      });

      return Promise.resolve();
    });

    sinon
      .stub(eventMessaging, 'notifyEventsForEventSeries')
      .callsFake(params => {
        expect(params).to.eql(testData.EVENT_SERIES_ID);
        return Promise.resolve();
      });

    sinon.stub(elasticsearch, 'bulk').callsFake(params => {
      expect(params).to.eql({
        body: [
          {
            index: {
              _index: globalConstants.SEARCH_INDEX_TYPE_EVENT_SERIES_FULL,
              _type: 'default',
              _id: testData.EVENT_SERIES_ID,
              _version: 5,
              _version_type: 'external',
            },
          },
          {
            entityType: 'event-series',
            id: testData.EVENT_SERIES_ID,
            name: 'Bang Said The Gun',
            name_sort: 'bang said the gun',
            status: 'Active',
            eventSeriesType: 'Occasional',
            occurrence: 'Third Thursday of each month',
            summary: 'A poetry riot',
            version: 5,
          },
          {
            index: {
              _index: globalConstants.SEARCH_INDEX_TYPE_EVENT_SERIES_AUTO,
              _type: 'default',
              _id: testData.EVENT_SERIES_ID,
              _version: 5,
              _version_type: 'external',
            },
          },
          {
            nameSuggest: ['bang said the gun'],
            output: 'Bang Said The Gun (Event Series)',
            id: testData.EVENT_SERIES_ID,
            status: 'Active',
            entityType: 'event-series',
            version: 5,
          },
          {
            index: {
              _index: globalConstants.SEARCH_INDEX_TYPE_COMBINED_EVENT_AUTO,
              _type: 'default',
              _id: testData.EVENT_SERIES_ID,
              _version: 5,
              _version_type: 'external',
            },
          },
          {
            nameSuggest: ['bang said the gun'],
            output: 'Bang Said The Gun (Event Series)',
            id: testData.EVENT_SERIES_ID,
            status: 'Active',
            entityType: 'event-series',
            version: 5,
          },
        ],
      });

      return Promise.resolve();
    });

    sinon.stub(etag, 'writeETagToRedis').callsFake(key => {
      expect(key).to.eql('event-series/' + testData.EVENT_SERIES_ID);
      return Promise.resolve();
    });

    const expected = {
      id: testData.EVENT_SERIES_ID,
      name: 'Bang Said The Gun',
      status: 'Active',
      eventSeriesType: 'Occasional',
      occurrence: 'Third Thursday of each month',
      summary: 'A poetry riot',
      description: 'Poetry for people who dont like poetry.',
      version: 5,
      schemeVersion: eventSeriesConstants.CURRENT_EVENT_SERIES_SCHEME_VERSION,
      createdDate: '2016/01/10',
      updatedDate: '2016/01/11',
    };

    eventSeriesService
      .createOrUpdateEventSeries(testData.EVENT_SERIES_ID, {
        name: 'Bang Said The Gun',
        status: 'Active',
        eventSeriesType: 'Occasional',
        occurrence: 'Third Thursday of each month',
        summary: 'A poetry riot',
        description: 'Poetry for people who dont like poetry.',
        version: 5,
        createdDate: '2016/01/10',
        updatedDate: '2016/01/11',
      })
      .then(response => expect(response).to.eql(expected))
      .then(() => done())
      .catch(done);
  });
});

describe('getEventSeriesForEdit', () => {
  afterEach(() => {
    dynamoDbClient.get.restore();
  });

  it('should process a request', done => {
    sinon.stub(dynamoDbClient, 'get').callsFake(params => {
      expect(params).to.eql({
        TableName: process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME,
        Key: { id: testData.EVENT_SERIES_ID },
        ConsistentRead: true,
        ReturnConsumedCapacity: undefined,
      });

      const dbItem = testData.createMinimalDbEventSeries();
      return Promise.resolve(dbItem);
    });

    const expected = {
      id: testData.EVENT_SERIES_ID,
      name: 'Bang Said The Gun',
      status: 'Active',
      eventSeriesType: 'Occasional',
      occurrence: 'Third Thursday of each month',
      summary: 'A poetry riot',
      description: 'Poetry for people who dont like poetry.',
      createdDate: '2016/01/10',
      updatedDate: '2016/01/11',
      schemeVersion: eventSeriesConstants.CURRENT_EVENT_SERIES_SCHEME_VERSION,
      version: 1,
    };

    eventSeriesService
      .getEventSeriesForEdit('bang-said-the-gun')
      .then(response => expect(response).to.eql(expected))
      .then(() => done())
      .catch(done);
  });
});

describe('getEventSeriesMulti', () => {
  afterEach(() => {
    dynamoDbClient.batchGet.restore();
  });

  it('should process a request', done => {
    sinon.stub(dynamoDbClient, 'batchGet').callsFake(params => {
      expect(
        params.RequestItems[process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME].Keys
      ).to.eql([{ id: 'tate-modern-art' }, { id: 'bang-said-the-gun' }]);

      return Promise.resolve({
        Responses: {
          [process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME]: [
            {
              id: 'tate-modern-art',
            },
            {
              id: 'bang-said-the-gun',
            },
          ],
        },
      });
    });

    const expected = [
      {
        entityType: 'event-series',
        id: 'tate-modern-art',
      },
      {
        entityType: 'event-series',
        id: 'bang-said-the-gun',
      },
    ];

    eventSeriesService
      .getEventSeriesMulti(['tate-modern-art', 'bang-said-the-gun'])
      .then(response => expect(response).to.containSubset(expected))
      .then(() => done())
      .catch(done);
  });
});

describe('getEventSeries', () => {
  afterEach(() => {
    dynamoDbClient.get.restore();
  });

  it('should process an admin request', done => {
    sinon.stub(dynamoDbClient, 'get').callsFake(params => {
      expect(params).to.eql({
        TableName: process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME,
        Key: { id: testData.EVENT_SERIES_ID },
        ConsistentRead: true,
        ReturnConsumedCapacity: undefined,
      });

      return Promise.resolve(testData.createMinimalDbEventSeries());
    });

    const expected = {
      entityType: 'event-series',
      isFullEntity: true,
      id: testData.EVENT_SERIES_ID,
      name: 'Bang Said The Gun',
      status: 'Active',
      eventSeriesType: 'Occasional',
      occurrence: 'Third Thursday of each month',
      summary: 'A poetry riot',
      description: 'Poetry for people who dont like poetry.',
    };

    eventSeriesService
      .getEventSeries(testData.EVENT_SERIES_ID, false)
      .then(response => expect(response).to.eql(expected))
      .then(() => done())
      .catch(done);
  });

  it('should process a public request', done => {
    sinon.stub(dynamoDbClient, 'get').callsFake(params => {
      expect(params).to.eql({
        TableName: process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME,
        Key: { id: testData.EVENT_SERIES_ID },
        ConsistentRead: false,
        ReturnConsumedCapacity: undefined,
      });

      return Promise.resolve(testData.createMinimalDbEventSeries());
    });

    const expected = {
      entityType: 'event-series',
      isFullEntity: true,
      id: testData.EVENT_SERIES_ID,
      name: 'Bang Said The Gun',
      status: 'Active',
      eventSeriesType: 'Occasional',
      occurrence: 'Third Thursday of each month',
      summary: 'A poetry riot',
      description: 'Poetry for people who dont like poetry.',
    };

    eventSeriesService
      .getEventSeries(testData.EVENT_SERIES_ID, true)
      .then(response => expect(response).to.eql(expected))
      .then(() => done())
      .catch(done);
  });
});
