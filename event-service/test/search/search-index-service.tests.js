'use strict';

const moment = require('moment');
const sinon = require('sinon');
const expect = require('chai').expect;
const dynamoDbClient = require('dynamodb-doc-client-wrapper');
const elasticsearch = require('../../lib/external-services/elasticsearch');
const testData = require('../test-data');
const globalConstants = require('../../lib/constants');
const searchIndexService = require('../../lib/search/search-index-service');
const etag = require('../../lib/lambda/etag');
const sns = require('../../lib/external-services/sns');

process.env.SERVERLESS_REFRESH_SEARCH_INDEX_TOPIC_ARN = 'refresh-search-index';
process.env.SERVERLESS_TALENT_TABLE_NAME = 'talent-table';
process.env.SERVERLESS_VENUE_TABLE_NAME = 'venue-table';
process.env.SERVERLESS_EVENT_TABLE_NAME = 'event-table';
process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME = 'event-series-table';

describe('refreshEventFullSearch', () => {
  afterEach(() => {
    sns.notify.restore();
  });

  it('should process a request', done => {
    sinon.stub(sns, 'notify').callsFake((body, headers) => {
      expect(body).to.eql({
        index: globalConstants.SEARCH_INDEX_TYPE_EVENT_FULL,
        version: 'latest',
        entity: 'event',
        exclusiveStartKey: null,
      });

      expect(headers).to.eql({ arn: 'refresh-search-index' });

      return Promise.resolve();
    });

    searchIndexService.refreshEventFullSearch().then(() => done()).catch(done);
  });
});

describe('processRefreshSearchIndexMessage', () => {
  afterEach(() => {
    dynamoDbClient.scanBasic.restore();
    dynamoDbClient.batchGet.restore();
    elasticsearch.bulk.restore();
    sns.notify.restore();
  });

  it('should refresh talents in the talent full index when multiple scans are required', done => {
    sinon.stub(dynamoDbClient, 'scanBasic').callsFake(params => {
      expect(params).to.eql({
        TableName: process.env.SERVERLESS_TALENT_TABLE_NAME,
        ExclusiveStartKey: null,
        Limit: globalConstants.REFRESH_SEARCH_INDEX_MAX_TAKE_PER_SCAN,
        ConsistentRead: false,
      });

      return Promise.resolve({
        Items: [testData.createMinimalIndividualDbTalent()],
        LastEvaluatedKey: 'some-talent',
      });
    });

    sinon.stub(elasticsearch, 'bulk').callsFake(params => {
      expect(params).to.eql({
        body: [
          {
            index: {
              _index: globalConstants.SEARCH_INDEX_TYPE_TALENT_FULL + '_v10',
              _type: 'default',
              _id: testData.INDIVIDUAL_TALENT_ID,
              _version: 3,
              _version_type: 'external',
            },
          },
          {
            entityType: 'talent',
            id: testData.INDIVIDUAL_TALENT_ID,
            firstNames: 'Carrie',
            lastName: 'Cracknell',
            lastName_sort: 'cracknell',
            status: 'Active',
            talentType: 'Individual',
            commonRole: 'Actor',
            version: 3,
          },
        ],
      });

      return Promise.resolve();
    });

    sinon.stub(dynamoDbClient, 'batchGet').callsFake(() => {
      return Promise.reject(new Error('batchGet should not have been invoked'));
    });

    sinon.stub(sns, 'notify').callsFake((body, headers) => {
      expect(body).to.eql({
        index: globalConstants.SEARCH_INDEX_TYPE_TALENT_FULL,
        version: 10,
        entity: 'talent',
        exclusiveStartKey: 'some-talent',
      });

      expect(headers).to.eql({ arn: 'refresh-search-index' });

      return Promise.resolve();
    });

    searchIndexService
      .processRefreshSearchIndexMessage({
        index: globalConstants.SEARCH_INDEX_TYPE_TALENT_FULL,
        version: 10,
        entity: 'talent',
        exclusiveStartKey: null,
      })
      .then(() => done())
      .catch(done);
  });

  it('should refresh talents in the talent full index when no index version is specified', done => {
    sinon.stub(dynamoDbClient, 'scanBasic').callsFake(params => {
      expect(params).to.eql({
        TableName: process.env.SERVERLESS_TALENT_TABLE_NAME,
        ExclusiveStartKey: null,
        Limit: globalConstants.REFRESH_SEARCH_INDEX_MAX_TAKE_PER_SCAN,
        ConsistentRead: false,
      });

      return Promise.resolve({
        Items: [testData.createMinimalIndividualDbTalent()],
      });
    });

    sinon.stub(elasticsearch, 'bulk').callsFake(params => {
      expect(params).to.eql({
        body: [
          {
            index: {
              _index: globalConstants.SEARCH_INDEX_TYPE_TALENT_FULL,
              _type: 'default',
              _id: testData.INDIVIDUAL_TALENT_ID,
              _version: 3,
              _version_type: 'external',
            },
          },
          {
            entityType: 'talent',
            id: testData.INDIVIDUAL_TALENT_ID,
            firstNames: 'Carrie',
            lastName: 'Cracknell',
            lastName_sort: 'cracknell',
            status: 'Active',
            talentType: 'Individual',
            commonRole: 'Actor',
            version: 3,
          },
        ],
      });

      return Promise.resolve();
    });

    sinon.stub(dynamoDbClient, 'batchGet').callsFake(() => {
      return Promise.reject(new Error('batchGet should not have been invoked'));
    });

    sinon.stub(sns, 'notify').callsFake(() => {
      return Promise.reject(new Error('notify should not have been invoked'));
    });

    searchIndexService
      .processRefreshSearchIndexMessage({
        index: globalConstants.SEARCH_INDEX_TYPE_TALENT_FULL,
        version: undefined,
        entity: 'talent',
        exclusiveStartKey: null,
      })
      .then(() => done())
      .catch(done);
  });

  it('should refresh talents in the talent full index', done => {
    sinon.stub(dynamoDbClient, 'scanBasic').callsFake(params => {
      expect(params).to.eql({
        TableName: process.env.SERVERLESS_TALENT_TABLE_NAME,
        ExclusiveStartKey: null,
        Limit: globalConstants.REFRESH_SEARCH_INDEX_MAX_TAKE_PER_SCAN,
        ConsistentRead: false,
      });

      return Promise.resolve({
        Items: [testData.createMinimalIndividualDbTalent()],
      });
    });

    sinon.stub(elasticsearch, 'bulk').callsFake(params => {
      expect(params).to.eql({
        body: [
          {
            index: {
              _index: globalConstants.SEARCH_INDEX_TYPE_TALENT_FULL + '_v10',
              _type: 'default',
              _id: testData.INDIVIDUAL_TALENT_ID,
              _version: 3,
              _version_type: 'external',
            },
          },
          {
            entityType: 'talent',
            id: testData.INDIVIDUAL_TALENT_ID,
            firstNames: 'Carrie',
            lastName: 'Cracknell',
            lastName_sort: 'cracknell',
            status: 'Active',
            talentType: 'Individual',
            commonRole: 'Actor',
            version: 3,
          },
        ],
      });

      return Promise.resolve();
    });

    sinon.stub(dynamoDbClient, 'batchGet').callsFake(() => {
      return Promise.reject(new Error('batchGet should not have been invoked'));
    });

    sinon.stub(sns, 'notify').callsFake(() => {
      return Promise.reject(new Error('notify should not have been invoked'));
    });

    searchIndexService
      .processRefreshSearchIndexMessage({
        index: globalConstants.SEARCH_INDEX_TYPE_TALENT_FULL,
        version: 10,
        entity: 'talent',
        exclusiveStartKey: null,
      })
      .then(() => done())
      .catch(done);
  });

  it('should refresh talents in the talent auto index', done => {
    sinon.stub(dynamoDbClient, 'scanBasic').callsFake(params => {
      expect(params).to.eql({
        TableName: process.env.SERVERLESS_TALENT_TABLE_NAME,
        ExclusiveStartKey: null,
        Limit: globalConstants.REFRESH_SEARCH_INDEX_MAX_TAKE_PER_SCAN,
        ConsistentRead: false,
      });

      return Promise.resolve({
        Items: [testData.createMinimalIndividualDbTalent()],
      });
    });

    sinon.stub(elasticsearch, 'bulk').callsFake(params => {
      expect(params).to.eql({
        body: [
          {
            index: {
              _index: globalConstants.SEARCH_INDEX_TYPE_TALENT_AUTO + '_v10',
              _type: 'default',
              _id: testData.INDIVIDUAL_TALENT_ID,
              _version: 3,
              _version_type: 'external',
            },
          },
          {
            nameSuggest: ['carrie cracknell', 'cracknell'],
            output: 'Carrie Cracknell',
            id: testData.INDIVIDUAL_TALENT_ID,
            status: 'Active',
            talentType: 'Individual',
            commonRole: 'Actor',
            entityType: 'talent',
            version: 3,
          },
        ],
      });

      return Promise.resolve();
    });

    sinon.stub(dynamoDbClient, 'batchGet').callsFake(() => {
      return Promise.reject(new Error('batchGet should not have been invoked'));
    });

    sinon.stub(sns, 'notify').callsFake(() => {
      return Promise.reject(new Error('notify should not have been invoked'));
    });

    searchIndexService
      .processRefreshSearchIndexMessage({
        index: globalConstants.SEARCH_INDEX_TYPE_TALENT_AUTO,
        version: 10,
        entity: 'talent',
        exclusiveStartKey: null,
      })
      .then(() => done())
      .catch(done);
  });

  it('should refresh venues in the venue full index', done => {
    sinon.stub(dynamoDbClient, 'scanBasic').callsFake(params => {
      expect(params).to.eql({
        TableName: process.env.SERVERLESS_VENUE_TABLE_NAME,
        ExclusiveStartKey: null,
        Limit: globalConstants.REFRESH_SEARCH_INDEX_MAX_TAKE_PER_SCAN,
        ConsistentRead: false,
      });

      return Promise.resolve({
        Items: [testData.createMinimalDbVenue()],
      });
    });

    sinon.stub(elasticsearch, 'bulk').callsFake(params => {
      expect(params).to.eql({
        body: [
          {
            index: {
              _index: globalConstants.SEARCH_INDEX_TYPE_VENUE_FULL + '_v10',
              _type: 'default',
              _id: testData.MINIMAL_VENUE_ID,
              _version: 1,
              _version_type: 'external',
            },
          },
          {
            entityType: 'venue',
            id: testData.MINIMAL_VENUE_ID,
            name: 'Almeida Theatre',
            name_sort: 'almeida theatre',
            status: 'Active',
            venueType: 'Theatre',
            address: 'Almeida St\nIslington',
            postcode: 'N1 1TA',
            latitude: 51.539464,
            longitude: -0.103103,
            locationOptimized: { lat: 51.539464, lon: -0.103103 },
            version: 1,
          },
        ],
      });

      return Promise.resolve();
    });

    sinon.stub(dynamoDbClient, 'batchGet').callsFake(() => {
      return Promise.reject(new Error('batchGet should not have been invoked'));
    });

    sinon.stub(sns, 'notify').callsFake(() => {
      return Promise.reject(new Error('notify should not have been invoked'));
    });

    searchIndexService
      .processRefreshSearchIndexMessage({
        index: globalConstants.SEARCH_INDEX_TYPE_VENUE_FULL,
        version: 10,
        entity: 'venue',
        exclusiveStartKey: null,
      })
      .then(() => done())
      .catch(done);
  });

  it('should refresh venues in the venue auto index', done => {
    sinon.stub(dynamoDbClient, 'scanBasic').callsFake(params => {
      expect(params).to.eql({
        TableName: process.env.SERVERLESS_VENUE_TABLE_NAME,
        ExclusiveStartKey: null,
        Limit: globalConstants.REFRESH_SEARCH_INDEX_MAX_TAKE_PER_SCAN,
        ConsistentRead: false,
      });

      return Promise.resolve({
        Items: [testData.createMinimalDbVenue()],
      });
    });

    sinon.stub(elasticsearch, 'bulk').callsFake(params => {
      expect(params).to.eql({
        body: [
          {
            index: {
              _index: globalConstants.SEARCH_INDEX_TYPE_VENUE_AUTO + '_v10',
              _type: 'default',
              _id: testData.MINIMAL_VENUE_ID,
              _version: 1,
              _version_type: 'external',
            },
          },
          {
            nameSuggest: ['almeida theatre'],
            output: 'Almeida Theatre',
            id: testData.MINIMAL_VENUE_ID,
            status: 'Active',
            venueType: 'Theatre',
            address: 'Almeida St\nIslington',
            postcode: 'N1 1TA',
            entityType: 'venue',
            version: 1,
          },
        ],
      });

      return Promise.resolve();
    });

    sinon.stub(dynamoDbClient, 'batchGet').callsFake(() => {
      return Promise.reject(new Error('batchGet should not have been invoked'));
    });

    sinon.stub(sns, 'notify').callsFake(() => {
      return Promise.reject(new Error('notify should not have been invoked'));
    });

    searchIndexService
      .processRefreshSearchIndexMessage({
        index: globalConstants.SEARCH_INDEX_TYPE_VENUE_AUTO,
        version: 10,
        entity: 'venue',
        exclusiveStartKey: null,
      })
      .then(() => done())
      .catch(done);
  });

  it('should refresh event series in the event series full index', done => {
    sinon.stub(dynamoDbClient, 'scanBasic').callsFake(params => {
      expect(params).to.eql({
        TableName: process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME,
        ExclusiveStartKey: null,
        Limit: globalConstants.REFRESH_SEARCH_INDEX_MAX_TAKE_PER_SCAN,
        ConsistentRead: false,
      });

      return Promise.resolve({
        Items: [testData.createMinimalDbEventSeries()],
      });
    });

    sinon.stub(elasticsearch, 'bulk').callsFake(params => {
      expect(params).to.eql({
        body: [
          {
            index: {
              _index: globalConstants.SEARCH_INDEX_TYPE_EVENT_SERIES_FULL +
                '_v10',
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
            summary: 'A poetry riot',
            occurrence: 'Third Thursday of each month',
            version: 1,
          },
        ],
      });

      return Promise.resolve();
    });

    sinon.stub(dynamoDbClient, 'batchGet').callsFake(() => {
      return Promise.reject(new Error('batchGet should not have been invoked'));
    });

    sinon.stub(sns, 'notify').callsFake(() => {
      return Promise.reject(new Error('notify should not have been invoked'));
    });

    searchIndexService
      .processRefreshSearchIndexMessage({
        index: globalConstants.SEARCH_INDEX_TYPE_EVENT_SERIES_FULL,
        version: 10,
        entity: 'event-series',
        exclusiveStartKey: null,
      })
      .then(() => done())
      .catch(done);
  });

  it('should refresh event series in the event series auto index', done => {
    sinon.stub(dynamoDbClient, 'scanBasic').callsFake(params => {
      expect(params).to.eql({
        TableName: process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME,
        ExclusiveStartKey: null,
        Limit: globalConstants.REFRESH_SEARCH_INDEX_MAX_TAKE_PER_SCAN,
        ConsistentRead: false,
      });

      return Promise.resolve({
        Items: [testData.createMinimalDbEventSeries()],
      });
    });

    sinon.stub(elasticsearch, 'bulk').callsFake(params => {
      expect(params).to.eql({
        body: [
          {
            index: {
              _index: globalConstants.SEARCH_INDEX_TYPE_EVENT_SERIES_AUTO +
                '_v10',
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

    sinon.stub(dynamoDbClient, 'batchGet').callsFake(() => {
      return Promise.reject(new Error('batchGet should not have been invoked'));
    });

    sinon.stub(sns, 'notify').callsFake(() => {
      return Promise.reject(new Error('notify should not have been invoked'));
    });

    searchIndexService
      .processRefreshSearchIndexMessage({
        index: globalConstants.SEARCH_INDEX_TYPE_EVENT_SERIES_AUTO,
        version: 10,
        entity: 'event-series',
        exclusiveStartKey: null,
      })
      .then(() => done())
      .catch(done);
  });

  it('should refresh event series in the combined event auto index', done => {
    sinon.stub(dynamoDbClient, 'scanBasic').callsFake(params => {
      expect(params).to.eql({
        TableName: process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME,
        ExclusiveStartKey: null,
        Limit: globalConstants.REFRESH_SEARCH_INDEX_MAX_TAKE_PER_SCAN,
        ConsistentRead: false,
      });

      return Promise.resolve({
        Items: [testData.createMinimalDbEventSeries()],
      });
    });

    sinon.stub(elasticsearch, 'bulk').callsFake(params => {
      expect(params).to.eql({
        body: [
          {
            index: {
              _index: globalConstants.SEARCH_INDEX_TYPE_COMBINED_EVENT_AUTO +
                '_v10',
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

    sinon.stub(dynamoDbClient, 'batchGet').callsFake(() => {
      return Promise.reject(new Error('batchGet should not have been invoked'));
    });

    sinon.stub(sns, 'notify').callsFake(() => {
      return Promise.reject(new Error('notify should not have been invoked'));
    });

    searchIndexService
      .processRefreshSearchIndexMessage({
        index: globalConstants.SEARCH_INDEX_TYPE_COMBINED_EVENT_AUTO,
        version: 10,
        entity: 'event-series',
        exclusiveStartKey: null,
      })
      .then(() => done())
      .catch(done);
  });

  it('should refresh events in the event full index', done => {
    sinon.stub(dynamoDbClient, 'scanBasic').callsFake(params => {
      expect(params).to.eql({
        TableName: process.env.SERVERLESS_EVENT_TABLE_NAME,
        ExclusiveStartKey: null,
        Limit: globalConstants.REFRESH_SEARCH_INDEX_MAX_TAKE_PER_SCAN,
        ConsistentRead: false,
      });

      const dbEvent = testData.createMinimalPerformanceDbEvent();
      dbEvent.venueId = testData.MINIMAL_VENUE_ID;

      return Promise.resolve({ Items: [dbEvent] });
    });

    sinon.stub(elasticsearch, 'bulk').callsFake(params => {
      expect(params).to.eql({
        body: [
          {
            index: {
              _index: globalConstants.SEARCH_INDEX_TYPE_EVENT_FULL + '_v10',
              _type: 'default',
              _id: testData.PERFORMANCE_EVENT_ID,
            },
          },
          {
            entityType: 'event',
            id: 'almeida-theatre/2016/taming-of-the-shrew',
            status: 'Active',
            name: 'Taming of the Shrew',
            name_sort: 'taming of the shrew',
            venueId: 'almeida-theatre',
            venueName: 'Almeida Theatre',
            venueName_sort: 'almeida theatre',
            area: 'Central',
            postcode: 'N1 1TA',
            eventType: 'Performance',
            occurrenceType: 'Bounded',
            dateFrom: '2016/02/11',
            dateTo: '2016/02/13',
            costType: 'Paid',
            bookingType: 'NotRequired',
            artsType: 'Performing',
            summary: 'A Shakespearian classic',
            rating: 3,
            latitude: 51.539464,
            longitude: -0.103103,
            locationOptimized: { lat: 51.539464, lon: -0.103103 },
            version: 4,
          },
        ],
      });

      return Promise.resolve();
    });

    sinon.stub(dynamoDbClient, 'batchGet').callsFake(params => {
      expect(params).to.eql({
        RequestItems: {
          [process.env.SERVERLESS_VENUE_TABLE_NAME]: {
            Keys: [{ id: testData.MINIMAL_VENUE_ID }],
            ConsistentRead: false,
          },
        },
        ReturnConsumedCapacity: undefined,
      });

      return Promise.resolve({
        Responses: {
          [process.env.SERVERLESS_VENUE_TABLE_NAME]: [
            testData.createMinimalDbVenue(),
          ],
        },
      });
    });

    sinon.stub(sns, 'notify').callsFake(() => {
      return Promise.reject(new Error('notify should not have been invoked'));
    });

    searchIndexService
      .processRefreshSearchIndexMessage({
        index: globalConstants.SEARCH_INDEX_TYPE_EVENT_FULL,
        version: 10,
        entity: 'event',
        exclusiveStartKey: null,
      })
      .then(() => done())
      .catch(done);
  });

  it('should refresh events in the combined event auto index', done => {
    sinon.stub(dynamoDbClient, 'scanBasic').callsFake(params => {
      expect(params).to.eql({
        TableName: process.env.SERVERLESS_EVENT_TABLE_NAME,
        ExclusiveStartKey: null,
        Limit: globalConstants.REFRESH_SEARCH_INDEX_MAX_TAKE_PER_SCAN,
        ConsistentRead: false,
      });

      const dbEvent = testData.createMinimalPerformanceDbEvent();
      dbEvent.venueId = testData.MINIMAL_VENUE_ID;

      return Promise.resolve({ Items: [dbEvent] });
    });

    sinon.stub(elasticsearch, 'bulk').callsFake(params => {
      expect(params).to.eql({
        body: [
          {
            index: {
              _index: globalConstants.SEARCH_INDEX_TYPE_COMBINED_EVENT_AUTO +
                '_v10',
              _type: 'default',
              _id: testData.PERFORMANCE_EVENT_ID,
              _version: 4,
              _version_type: 'external',
            },
          },
          {
            nameSuggest: ['taming of the shrew', 'almeida theatre'],
            output: 'Taming of the Shrew (Almeida Theatre)',
            id: 'almeida-theatre/2016/taming-of-the-shrew',
            status: 'Active',
            eventType: 'Performance',
            entityType: 'event',
            version: 4,
          },
        ],
      });

      return Promise.resolve();
    });

    sinon.stub(dynamoDbClient, 'batchGet').callsFake(params => {
      expect(params).to.eql({
        RequestItems: {
          [process.env.SERVERLESS_VENUE_TABLE_NAME]: {
            Keys: [{ id: testData.MINIMAL_VENUE_ID }],
            ConsistentRead: false,
          },
        },
        ReturnConsumedCapacity: undefined,
      });

      return Promise.resolve({
        Responses: {
          [process.env.SERVERLESS_VENUE_TABLE_NAME]: [
            testData.createMinimalDbVenue(),
          ],
        },
      });
    });

    sinon.stub(sns, 'notify').callsFake(() => {
      return Promise.reject(new Error('notify should not have been invoked'));
    });

    searchIndexService
      .processRefreshSearchIndexMessage({
        index: globalConstants.SEARCH_INDEX_TYPE_COMBINED_EVENT_AUTO,
        version: 10,
        entity: 'event',
        exclusiveStartKey: null,
      })
      .then(() => done())
      .catch(done);
  });
});

describe('refreshSearchIndex', () => {
  afterEach(() => {
    if (sns.notify.restore) {
      sns.notify.restore();
    }
  });

  it('should throw an error when request is invalid', done => {
    searchIndexService
      .refreshSearchIndex({
        index: 'Foo',
        version: 'latest',
      })
      .then(() => done(new Error('should have thrown exception')))
      .catch(() => done());
  });

  it('should handle the refresh of an index when latest index version is specified', done => {
    sinon.stub(sns, 'notify').callsFake((body, headers) => {
      expect(body).to.eql({
        index: globalConstants.SEARCH_INDEX_TYPE_TALENT_FULL,
        version: null,
        entity: 'talent',
        exclusiveStartKey: null,
      });

      expect(headers).to.eql({ arn: 'refresh-search-index' });

      return Promise.resolve();
    });

    searchIndexService
      .refreshSearchIndex({
        index: globalConstants.SEARCH_INDEX_TYPE_TALENT_FULL,
        version: 'latest',
      })
      .then(() => done())
      .catch(done);
  });

  it('should handle the refresh of the talent full index', done => {
    sinon.stub(sns, 'notify').callsFake((body, headers) => {
      expect(body).to.eql({
        index: globalConstants.SEARCH_INDEX_TYPE_TALENT_FULL,
        version: 10,
        entity: 'talent',
        exclusiveStartKey: null,
      });

      expect(headers).to.eql({ arn: 'refresh-search-index' });

      return Promise.resolve();
    });

    searchIndexService
      .refreshSearchIndex({
        index: globalConstants.SEARCH_INDEX_TYPE_TALENT_FULL,
        version: 10,
      })
      .then(() => done())
      .catch(done);
  });

  it('should handle the refresh of the talent auto index', done => {
    sinon.stub(sns, 'notify').callsFake((body, headers) => {
      expect(body).to.eql({
        index: globalConstants.SEARCH_INDEX_TYPE_TALENT_AUTO,
        version: 10,
        entity: 'talent',
        exclusiveStartKey: null,
      });

      expect(headers).to.eql({ arn: 'refresh-search-index' });

      return Promise.resolve();
    });

    searchIndexService
      .refreshSearchIndex({
        index: globalConstants.SEARCH_INDEX_TYPE_TALENT_AUTO,
        version: 10,
      })
      .then(() => done())
      .catch(done);
  });

  it('should handle the refresh of the venue full index', done => {
    sinon.stub(sns, 'notify').callsFake((body, headers) => {
      expect(body).to.eql({
        index: globalConstants.SEARCH_INDEX_TYPE_VENUE_FULL,
        version: 10,
        entity: 'venue',
        exclusiveStartKey: null,
      });

      expect(headers).to.eql({ arn: 'refresh-search-index' });

      return Promise.resolve();
    });

    searchIndexService
      .refreshSearchIndex({
        index: globalConstants.SEARCH_INDEX_TYPE_VENUE_FULL,
        version: 10,
      })
      .then(() => done())
      .catch(done);
  });

  it('should handle the refresh of the venue auto index', done => {
    sinon.stub(sns, 'notify').callsFake((body, headers) => {
      expect(body).to.eql({
        index: globalConstants.SEARCH_INDEX_TYPE_VENUE_AUTO,
        version: 10,
        entity: 'venue',
        exclusiveStartKey: null,
      });

      expect(headers).to.eql({ arn: 'refresh-search-index' });

      return Promise.resolve();
    });

    searchIndexService
      .refreshSearchIndex({
        index: globalConstants.SEARCH_INDEX_TYPE_VENUE_AUTO,
        version: 10,
      })
      .then(() => done())
      .catch(done);
  });

  it('should handle the refresh of the event series full index', done => {
    sinon.stub(sns, 'notify').callsFake((body, headers) => {
      expect(body).to.eql({
        index: globalConstants.SEARCH_INDEX_TYPE_EVENT_SERIES_FULL,
        version: 10,
        entity: 'event-series',
        exclusiveStartKey: null,
      });

      expect(headers).to.eql({ arn: 'refresh-search-index' });

      return Promise.resolve();
    });

    searchIndexService
      .refreshSearchIndex({
        index: globalConstants.SEARCH_INDEX_TYPE_EVENT_SERIES_FULL,
        version: 10,
      })
      .then(() => done())
      .catch(done);
  });

  it('should handle the refresh of the event series auto index', done => {
    sinon.stub(sns, 'notify').callsFake((body, headers) => {
      expect(body).to.eql({
        index: globalConstants.SEARCH_INDEX_TYPE_EVENT_SERIES_AUTO,
        version: 10,
        entity: 'event-series',
        exclusiveStartKey: null,
      });

      expect(headers).to.eql({ arn: 'refresh-search-index' });

      return Promise.resolve();
    });

    searchIndexService
      .refreshSearchIndex({
        index: globalConstants.SEARCH_INDEX_TYPE_EVENT_SERIES_AUTO,
        version: 10,
      })
      .then(() => done())
      .catch(done);
  });

  it('should handle the refresh of the event full index', done => {
    sinon.stub(sns, 'notify').callsFake((body, headers) => {
      expect(body).to.eql({
        index: globalConstants.SEARCH_INDEX_TYPE_EVENT_FULL,
        version: 10,
        entity: 'event',
        exclusiveStartKey: null,
      });

      expect(headers).to.eql({ arn: 'refresh-search-index' });

      return Promise.resolve();
    });

    searchIndexService
      .refreshSearchIndex({
        index: globalConstants.SEARCH_INDEX_TYPE_EVENT_FULL,
        version: 10,
      })
      .then(() => done())
      .catch(done);
  });

  it('should handle the refresh of the combined event auto index', done => {
    let notifyCount = 0;

    sinon.stub(sns, 'notify').callsFake((body, headers) => {
      ++notifyCount;

      expect(body).to.eql({
        index: globalConstants.SEARCH_INDEX_TYPE_COMBINED_EVENT_AUTO,
        version: 10,
        entity: notifyCount === 1 ? 'event' : 'event-series',
        exclusiveStartKey: null,
      });

      expect(headers).to.eql({ arn: 'refresh-search-index' });

      return Promise.resolve();
    });

    searchIndexService
      .refreshSearchIndex({
        index: globalConstants.SEARCH_INDEX_TYPE_COMBINED_EVENT_AUTO,
        version: 10,
      })
      .then(() => expect(notifyCount).to.eql(2))
      .then(() => done())
      .catch(done);
  });
});

describe('updateEventSearchIndex', () => {
  afterEach(() => {
    if (dynamoDbClient.get.restore) {
      dynamoDbClient.get.restore();
    }
    if (dynamoDbClient.batchGet.restore) {
      dynamoDbClient.batchGet.restore();
    }
    if (elasticsearch.bulk.restore) {
      elasticsearch.bulk.restore();
    }
    if (etag.writeETagToRedis.restore) {
      etag.writeETagToRedis.restore();
    }
  });

  it('should update an event in the event search indexes', done => {
    const futureDate = moment
      .utc()
      .startOf('day')
      .add(10, 'days')
      .format(globalConstants.DATE_FORMAT);

    sinon.stub(dynamoDbClient, 'get').callsFake(params => {
      expect(params).to.eql({
        TableName: process.env.SERVERLESS_EVENT_TABLE_NAME,
        Key: { id: testData.PERFORMANCE_EVENT_ID },
        ConsistentRead: true,
        ReturnConsumedCapacity: undefined,
      });

      const dbItem = testData.createMinimalPerformanceDbEvent();
      dbItem.venueId = testData.MINIMAL_VENUE_ID;
      dbItem.occurrenceType = 'Occasional';
      delete dbItem.dateFrom;
      delete dbItem.dateTo;

      dbItem.additionalPerformances = [
        { date: futureDate, at: '18:00' },
        { date: futureDate, at: '19:00' },
        { date: futureDate, at: '20:00' },
      ];

      dbItem.specialPerformances = [
        {
          date: futureDate,
          at: '18:00',
          audienceTags: [{ id: 'audience/family', label: 'family' }],
        },
        {
          date: futureDate,
          at: '19:00',
          audienceTags: [
            { id: 'audience/teenagers', label: 'teenagers' },
            { id: 'audience/family', label: 'family' },
          ],
        },
      ];

      return Promise.resolve(dbItem);
    });

    sinon.stub(dynamoDbClient, 'batchGet').callsFake(params => {
      expect(params).to.eql({
        RequestItems: {
          [process.env.SERVERLESS_VENUE_TABLE_NAME]: {
            Keys: [{ id: testData.MINIMAL_VENUE_ID }],
            ConsistentRead: true,
          },
        },
        ReturnConsumedCapacity: undefined,
      });

      return Promise.resolve({
        Responses: {
          [process.env.SERVERLESS_VENUE_TABLE_NAME]: [
            testData.createMinimalDbVenue(),
          ],
        },
      });
    });

    sinon.stub(elasticsearch, 'bulk').callsFake(params => {
      expect(params).to.eql({
        body: [
          {
            index: {
              _index: globalConstants.SEARCH_INDEX_TYPE_EVENT_FULL,
              _type: 'default',
              _id: testData.PERFORMANCE_EVENT_ID,
            },
          },
          {
            entityType: 'event',
            id: 'almeida-theatre/2016/taming-of-the-shrew',
            status: 'Active',
            name: 'Taming of the Shrew',
            name_sort: 'taming of the shrew',
            venueId: 'almeida-theatre',
            venueName: 'Almeida Theatre',
            venueName_sort: 'almeida theatre',
            area: 'Central',
            postcode: 'N1 1TA',
            eventType: 'Performance',
            occurrenceType: 'Occasional',
            costType: 'Paid',
            bookingType: 'NotRequired',
            artsType: 'Performing',
            summary: 'A Shakespearian classic',
            rating: 3,
            latitude: 51.539464,
            longitude: -0.103103,
            locationOptimized: { lat: 51.539464, lon: -0.103103 },
            dates: [
              {
                date: futureDate,
                from: '18:00',
                to: '18:00',
                tags: ['audience/family'],
              },
              {
                date: futureDate,
                from: '19:00',
                to: '19:00',
                tags: ['audience/teenagers', 'audience/family'],
              },
              {
                date: futureDate,
                from: '20:00',
                to: '20:00',
              },
            ],
            version: 4,
          },
          {
            index: {
              _index: globalConstants.SEARCH_INDEX_TYPE_COMBINED_EVENT_AUTO,
              _type: 'default',
              _id: testData.PERFORMANCE_EVENT_ID,
              _version: 4,
              _version_type: 'external',
            },
          },
          {
            nameSuggest: ['taming of the shrew', 'almeida theatre'],
            output: 'Taming of the Shrew (Almeida Theatre)',
            id: 'almeida-theatre/2016/taming-of-the-shrew',
            status: 'Active',
            eventType: 'Performance',
            entityType: 'event',
            version: 4,
          },
        ],
      });

      return Promise.resolve();
    });

    sinon.stub(etag, 'writeETagToRedis').callsFake(key => {
      expect(key).to.eql('event/' + testData.PERFORMANCE_EVENT_ID);
      return Promise.resolve();
    });

    searchIndexService
      .updateEventSearchIndex(testData.PERFORMANCE_EVENT_ID)
      .then(() => done())
      .catch(done);
  });
});
