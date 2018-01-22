'use strict';

const sinon = require('sinon');
const chai = require('chai');
chai.use(require('chai-subset'));
const expect = chai.expect;
const dynamoDbClient = require('dynamodb-doc-client-wrapper');
const testData = require('../test-data');
const venueService = require('../../lib/services/venue-service');
const venueConstants = require('../../lib/venue/constants');
const elasticsearch = require('../../lib/external-services/elasticsearch');
const eventMessaging = require('../../lib/event/messaging');
const etag = require('../../lib/lambda/etag');
const globalConstants = require('../../lib/constants');

process.env.SERVERLESS_VENUE_TABLE_NAME = 'venue-table';

describe('createOrUpdateVenue', () => {
  afterEach(() => {
    if (dynamoDbClient.put.restore) {
      dynamoDbClient.put.restore();
    }
    if (elasticsearch.bulk.restore) {
      elasticsearch.bulk.restore();
    }
    if (etag.writeETagToRedis.restore) {
      etag.writeETagToRedis.restore();
    }

    if (eventMessaging.notifyEventsForVenue.restore) {
      eventMessaging.notifyEventsForVenue.restore();
    }
  });

  it('should throw when request is invalid', done => {
    venueService
      .createOrUpdateVenue(null, { status: 'Foo' })
      .then(() => done(new Error('should have thrown exception')))
      .catch(() => done());
  });

  it('should process create venue request', done => {
    sinon.stub(dynamoDbClient, 'put').callsFake(params => {
      expect(params).to.eql({
        TableName: process.env.SERVERLESS_VENUE_TABLE_NAME,
        Item: {
          id: testData.MINIMAL_VENUE_ID,
          name: 'Almeida Theatre',
          status: 'Active',
          venueType: 'Theatre',
          address: 'Almeida St\nIslington',
          postcode: 'N1 1TA',
          latitude: 51.539464,
          longitude: -0.103103,
          description: 'A description',
          wheelchairAccessType: 'FullAccess',
          disabledBathroomType: 'Present',
          hearingFacilitiesType: 'HearingLoops',
          version: 1,
          schemeVersion: venueConstants.CURRENT_VENUE_SCHEME_VERSION,
          createdDate: '2016/01/10',
          updatedDate: '2016/01/11',
          hasPermanentCollection: true,
        },
        ConditionExpression: 'attribute_not_exists(id)',
        ReturnConsumedCapacity: undefined,
      });

      return Promise.resolve();
    });

    sinon.stub(eventMessaging, 'notifyEventsForVenue').callsFake(() => {
      return Promise.reject(
        new Error('notifyEventsForVenue should not have been invoked')
      );
    });

    sinon.stub(elasticsearch, 'bulk').callsFake(params => {
      expect(params).to.eql({
        body: [
          {
            index: {
              _index: globalConstants.SEARCH_INDEX_TYPE_VENUE_FULL,
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
          {
            index: {
              _index: globalConstants.SEARCH_INDEX_TYPE_VENUE_AUTO,
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

    sinon.stub(etag, 'writeETagToRedis').callsFake(key => {
      expect(key).to.eql('venue/' + testData.MINIMAL_VENUE_ID);
      return Promise.resolve();
    });

    const expected = {
      id: testData.MINIMAL_VENUE_ID,
      name: 'Almeida Theatre',
      status: 'Active',
      venueType: 'Theatre',
      description: 'A description',
      address: 'Almeida St\nIslington',
      postcode: 'N1 1TA',
      latitude: 51.539464,
      longitude: -0.103103,
      wheelchairAccessType: 'FullAccess',
      disabledBathroomType: 'Present',
      hearingFacilitiesType: 'HearingLoops',
      version: 1,
      schemeVersion: venueConstants.CURRENT_VENUE_SCHEME_VERSION,
      createdDate: '2016/01/10',
      updatedDate: '2016/01/11',
      hasPermanentCollection: true,
    };

    venueService
      .createOrUpdateVenue(null, {
        name: 'Almeida Theatre',
        status: 'Active',
        venueType: 'Theatre',
        address: 'Almeida St\nIslington',
        postcode: 'N1 1TA',
        latitude: 51.539464,
        longitude: -0.103103,
        description: 'A description',
        wheelchairAccessType: 'FullAccess',
        disabledBathroomType: 'Present',
        hearingFacilitiesType: 'HearingLoops',
        version: 1,
        createdDate: '2016/01/10',
        updatedDate: '2016/01/11',
        hasPermanentCollection: true,
      })
      .then(response => expect(response).to.eql(expected))
      .then(() => done())
      .catch(done);
  });

  it('should process update venue request', done => {
    sinon.stub(dynamoDbClient, 'put').callsFake(params => {
      expect(params).to.eql({
        TableName: process.env.SERVERLESS_VENUE_TABLE_NAME,
        Item: {
          id: testData.MINIMAL_VENUE_ID,
          name: 'Almeida Theatre',
          status: 'Active',
          venueType: 'Theatre',
          address: 'Almeida St\nIslington',
          postcode: 'N1 1TA',
          latitude: 51.539464,
          longitude: -0.103103,
          description: 'A description',
          wheelchairAccessType: 'FullAccess',
          disabledBathroomType: 'Present',
          hearingFacilitiesType: 'HearingLoops',
          version: 2,
          schemeVersion: venueConstants.CURRENT_VENUE_SCHEME_VERSION,
          createdDate: '2016/01/10',
          updatedDate: '2016/01/11',
          hasPermanentCollection: false,
        },
        ConditionExpression: 'attribute_exists(id) and version = :oldVersion',
        ExpressionAttributeValues: { ':oldVersion': 1 },
        ReturnConsumedCapacity: undefined,
      });

      return Promise.resolve();
    });

    sinon.stub(eventMessaging, 'notifyEventsForVenue').callsFake(params => {
      expect(params).to.eql(testData.MINIMAL_VENUE_ID);
      return Promise.resolve();
    });

    sinon.stub(elasticsearch, 'bulk').callsFake(params => {
      expect(params).to.eql({
        body: [
          {
            index: {
              _index: globalConstants.SEARCH_INDEX_TYPE_VENUE_FULL,
              _type: 'default',
              _id: testData.MINIMAL_VENUE_ID,
              _version: 2,
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
            version: 2,
          },
          {
            index: {
              _index: globalConstants.SEARCH_INDEX_TYPE_VENUE_AUTO,
              _type: 'default',
              _id: testData.MINIMAL_VENUE_ID,
              _version: 2,
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
            version: 2,
          },
        ],
      });

      return Promise.resolve();
    });

    sinon.stub(etag, 'writeETagToRedis').callsFake(() => {
      return Promise.resolve();
    });

    const expected = {
      id: testData.MINIMAL_VENUE_ID,
      name: 'Almeida Theatre',
      status: 'Active',
      venueType: 'Theatre',
      description: 'A description',
      address: 'Almeida St\nIslington',
      postcode: 'N1 1TA',
      latitude: 51.539464,
      longitude: -0.103103,
      wheelchairAccessType: 'FullAccess',
      disabledBathroomType: 'Present',
      hearingFacilitiesType: 'HearingLoops',
      version: 2,
      schemeVersion: venueConstants.CURRENT_VENUE_SCHEME_VERSION,
      createdDate: '2016/01/10',
      updatedDate: '2016/01/11',
      hasPermanentCollection: false,
    };

    venueService
      .createOrUpdateVenue(testData.MINIMAL_VENUE_ID, {
        name: 'Almeida Theatre',
        status: 'Active',
        venueType: 'Theatre',
        address: 'Almeida St\nIslington',
        postcode: 'N1 1TA',
        latitude: 51.539464,
        longitude: -0.103103,
        description: 'A description',
        wheelchairAccessType: 'FullAccess',
        disabledBathroomType: 'Present',
        hearingFacilitiesType: 'HearingLoops',
        version: 2,
        createdDate: '2016/01/10',
        updatedDate: '2016/01/11',
        hasPermanentCollection: false,
      })
      .then(response => expect(response).to.eql(expected))
      .then(() => done())
      .catch(done);
  });
});

describe('getVenueForEdit', () => {
  afterEach(() => {
    dynamoDbClient.get.restore();
  });

  it('should process get request', done => {
    sinon.stub(dynamoDbClient, 'get').callsFake(params => {
      expect(params).to.eql({
        TableName: process.env.SERVERLESS_VENUE_TABLE_NAME,
        Key: { id: testData.MINIMAL_VENUE_ID },
        ConsistentRead: true,
        ReturnConsumedCapacity: undefined,
      });

      const dbItem = testData.createMinimalDbVenue();
      return Promise.resolve(dbItem);
    });

    const expected = {
      id: testData.MINIMAL_VENUE_ID,
      status: 'Active',
      name: 'Almeida Theatre',
      venueType: 'Theatre',
      address: 'Almeida St\nIslington',
      postcode: 'N1 1TA',
      latitude: 51.539464,
      longitude: -0.103103,
      wheelchairAccessType: 'FullAccess',
      disabledBathroomType: 'Present',
      hearingFacilitiesType: 'HearingLoops',
      hasPermanentCollection: false,
      createdDate: '2016/01/10',
      updatedDate: '2016/01/11',
      schemeVersion: venueConstants.CURRENT_VENUE_SCHEME_VERSION,
      version: 1,
    };

    venueService
      .getVenueForEdit(testData.MINIMAL_VENUE_ID)
      .then(response => expect(response).to.eql(expected))
      .then(() => done())
      .catch(done);
  });
});

describe('getVenueMulti', () => {
  afterEach(() => {
    dynamoDbClient.batchGet.restore();
  });

  it('should process a request', done => {
    sinon.stub(dynamoDbClient, 'batchGet').callsFake(params => {
      expect(
        params.RequestItems[process.env.SERVERLESS_VENUE_TABLE_NAME].Keys
      ).to.eql([{ id: 'almeida-theatre' }, { id: 'tate-modern' }]);

      return Promise.resolve({
        Responses: {
          [process.env.SERVERLESS_VENUE_TABLE_NAME]: [
            {
              id: 'almeida-theatre',
            },
            {
              id: 'tate-modern',
            },
          ],
        },
      });
    });

    const expected = [
      {
        entityType: 'venue',
        id: 'almeida-theatre',
      },
      {
        entityType: 'venue',
        id: 'tate-modern',
      },
    ];

    venueService
      .getVenueMulti(['almeida-theatre', 'tate-modern'])
      .then(response => expect(response).to.containSubset(expected))
      .then(() => done())
      .catch(done);
  });
});

describe('getVenue', () => {
  afterEach(() => {
    dynamoDbClient.get.restore();
  });

  it('should process admin get venue request', done => {
    sinon.stub(dynamoDbClient, 'get').callsFake(params => {
      expect(params).to.eql({
        TableName: process.env.SERVERLESS_VENUE_TABLE_NAME,
        Key: { id: testData.MINIMAL_VENUE_ID },
        ConsistentRead: true,
        ReturnConsumedCapacity: undefined,
      });

      return Promise.resolve(testData.createMinimalDbVenue());
    });

    const expected = {
      entityType: 'venue',
      isFullEntity: true,
      id: testData.MINIMAL_VENUE_ID,
      status: 'Active',
      name: 'Almeida Theatre',
      venueType: 'Theatre',
      address: 'Almeida St\nIslington',
      postcode: 'N1 1TA',
      latitude: 51.539464,
      longitude: -0.103103,
      wheelchairAccessType: 'FullAccess',
      disabledBathroomType: 'Present',
      hearingFacilitiesType: 'HearingLoops',
      hasPermanentCollection: false,
    };

    venueService
      .getVenue(testData.MINIMAL_VENUE_ID, false)
      .then(response => expect(response).to.eql(expected))
      .then(() => done())
      .catch(done);
  });

  it('should process public get venue request', done => {
    sinon.stub(dynamoDbClient, 'get').callsFake(params => {
      expect(params).to.eql({
        TableName: process.env.SERVERLESS_VENUE_TABLE_NAME,
        Key: { id: testData.MINIMAL_VENUE_ID },
        ConsistentRead: false,
        ReturnConsumedCapacity: undefined,
      });

      return Promise.resolve(testData.createMinimalDbVenue());
    });

    const expected = {
      entityType: 'venue',
      isFullEntity: true,
      id: testData.MINIMAL_VENUE_ID,
      status: 'Active',
      name: 'Almeida Theatre',
      venueType: 'Theatre',
      address: 'Almeida St\nIslington',
      postcode: 'N1 1TA',
      latitude: 51.539464,
      longitude: -0.103103,
      wheelchairAccessType: 'FullAccess',
      disabledBathroomType: 'Present',
      hearingFacilitiesType: 'HearingLoops',
      hasPermanentCollection: false,
    };

    venueService
      .getVenue(testData.MINIMAL_VENUE_ID, true)
      .then(response => expect(response).to.eql(expected))
      .then(() => done())
      .catch(done);
  });
});
