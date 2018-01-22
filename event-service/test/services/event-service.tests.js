'use strict';

const sinon = require('sinon');
const chai = require('chai');
chai.use(require('chai-subset'));
const expect = chai.expect;
const dynamoDbClient = require('dynamodb-doc-client-wrapper');
const testData = require('../test-data');
const eventService = require('../../lib/services/event-service');
const populate = require('../../lib/event/populate');
const eventConstants = require('../../lib/event/constants');
const sns = require('../../lib/external-services/sns');

process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME = 'event-series-table';
process.env.SERVERLESS_EVENT_TABLE_NAME = 'event-table';
process.env.SERVERLESS_VENUE_TABLE_NAME = 'venue-table';
process.env.SERVERLESS_TALENT_TABLE_NAME = 'talent-table';

describe('createOrUpdateEvent', () => {
  afterEach(() => {
    if (dynamoDbClient.batchGet.restore) {
      dynamoDbClient.batchGet.restore();
    }

    if (dynamoDbClient.put.restore) {
      dynamoDbClient.put.restore();
    }

    if (sns.notify.restore) {
      sns.notify.restore();
    }
  });

  it('should throw when request is invalid', done => {
    eventService
      .createOrUpdateEvent(null, { status: 'Foo' })
      .then(() => done(new Error('should have thrown an exception')))
      .catch(() => done());
  });

  it('should process create event request', done => {
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

    sinon.stub(dynamoDbClient, 'put').callsFake(params => {
      expect(params).to.eql({
        TableName: process.env.SERVERLESS_EVENT_TABLE_NAME,
        Item: {
          id: testData.PERFORMANCE_EVENT_ID,
          status: 'Active',
          name: 'Taming of the Shrew',
          eventType: 'Performance',
          occurrenceType: 'Bounded',
          bookingType: 'NotRequired',
          dateFrom: '2016/02/11',
          dateTo: '2016/02/13',
          rating: 3,
          useVenueOpeningTimes: false,
          costType: 'Free',
          summary: 'A Shakespearian classic',
          description: 'A contemporary update of this Shakespearian classic',
          venueId: testData.MINIMAL_VENUE_ID,
          version: 1,
          schemeVersion: eventConstants.CURRENT_EVENT_SCHEME_VERSION,
          createdDate: '2016/01/10',
          updatedDate: '2016/01/11',
        },
        ConditionExpression: 'attribute_not_exists(id)',
        ReturnConsumedCapacity: undefined,
      });

      return Promise.resolve();
    });

    sinon.stub(sns, 'notify').callsFake((body, headers) => {
      expect(body).to.eql(testData.PERFORMANCE_EVENT_ID);
      expect(headers).to.eql({ arn: 'event-updated' });
      return Promise.resolve();
    });

    const expected = {
      id: testData.PERFORMANCE_EVENT_ID,
      status: 'Active',
      name: 'Taming of the Shrew',
      eventType: 'Performance',
      occurrenceType: 'Bounded',
      bookingType: 'NotRequired',
      dateFrom: '2016/02/11',
      dateTo: '2016/02/13',
      rating: 3,
      useVenueOpeningTimes: false,
      costType: 'Free',
      summary: 'A Shakespearian classic',
      description: 'A contemporary update of this Shakespearian classic',
      version: 1,
      schemeVersion: eventConstants.CURRENT_EVENT_SCHEME_VERSION,
      createdDate: '2016/01/10',
      updatedDate: '2016/01/11',
      venue: {
        entityType: 'venue',
        address: 'Almeida St\nIslington',
        id: 'almeida-theatre',
        latitude: 51.539464,
        longitude: -0.103103,
        name: 'Almeida Theatre',
        postcode: 'N1 1TA',
        status: 'Active',
        venueType: 'Theatre',
        disabledBathroomType: 'Present',
        hearingFacilitiesType: 'HearingLoops',
        wheelchairAccessType: 'FullAccess',
        hasPermanentCollection: false,
      },
    };

    eventService
      .createOrUpdateEvent(null, {
        status: 'Active',
        name: 'Taming of the Shrew',
        eventType: 'Performance',
        occurrenceType: 'Bounded',
        bookingType: 'NotRequired',
        dateFrom: '2016/02/11',
        dateTo: '2016/02/13',
        rating: 3,
        useVenueOpeningTimes: false,
        costType: 'Free',
        summary: 'A Shakespearian classic',
        description: 'A contemporary update of this Shakespearian classic',
        venueId: testData.MINIMAL_VENUE_ID,
        version: 1,
        createdDate: '2016/01/10',
        updatedDate: '2016/01/11',
      })
      .then(response => expect(response).to.eql(expected))
      .then(() => done())
      .catch(done);
  });

  it('should process update event request', done => {
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

    sinon.stub(dynamoDbClient, 'put').callsFake(params => {
      expect(params).to.eql({
        TableName: process.env.SERVERLESS_EVENT_TABLE_NAME,
        Item: {
          id: testData.PERFORMANCE_EVENT_ID,
          status: 'Active',
          name: 'Taming of the Shrew',
          eventType: 'Performance',
          occurrenceType: 'Bounded',
          bookingType: 'NotRequired',
          dateFrom: '2016/02/11',
          dateTo: '2016/02/13',
          rating: 3,
          useVenueOpeningTimes: false,
          costType: 'Free',
          summary: 'A Shakespearian classic',
          description: 'A contemporary update of this Shakespearian classic',
          venueId: testData.MINIMAL_VENUE_ID,
          version: 3,
          schemeVersion: eventConstants.CURRENT_EVENT_SCHEME_VERSION,
          createdDate: '2016/01/10',
          updatedDate: '2016/01/11',
        },
        ConditionExpression: 'attribute_exists(id) and version = :oldVersion',
        ExpressionAttributeValues: { ':oldVersion': 2 },
        ReturnConsumedCapacity: undefined,
      });

      return Promise.resolve();
    });

    sinon.stub(sns, 'notify').callsFake((body, headers) => {
      expect(body).to.eql(testData.PERFORMANCE_EVENT_ID);
      expect(headers).to.eql({ arn: 'event-updated' });
      return Promise.resolve();
    });

    const expected = {
      id: testData.PERFORMANCE_EVENT_ID,
      status: 'Active',
      name: 'Taming of the Shrew',
      eventType: 'Performance',
      occurrenceType: 'Bounded',
      bookingType: 'NotRequired',
      dateFrom: '2016/02/11',
      dateTo: '2016/02/13',
      rating: 3,
      useVenueOpeningTimes: false,
      costType: 'Free',
      summary: 'A Shakespearian classic',
      description: 'A contemporary update of this Shakespearian classic',
      version: 3,
      schemeVersion: eventConstants.CURRENT_EVENT_SCHEME_VERSION,
      createdDate: '2016/01/10',
      updatedDate: '2016/01/11',
      venue: {
        entityType: 'venue',
        address: 'Almeida St\nIslington',
        id: 'almeida-theatre',
        latitude: 51.539464,
        longitude: -0.103103,
        name: 'Almeida Theatre',
        postcode: 'N1 1TA',
        status: 'Active',
        venueType: 'Theatre',
        disabledBathroomType: 'Present',
        hearingFacilitiesType: 'HearingLoops',
        wheelchairAccessType: 'FullAccess',
        hasPermanentCollection: false,
      },
    };

    eventService
      .createOrUpdateEvent('almeida-theatre/2016/taming-of-the-shrew', {
        status: 'Active',
        name: 'Taming of the Shrew',
        eventType: 'Performance',
        occurrenceType: 'Bounded',
        bookingType: 'NotRequired',
        dateFrom: '2016/02/11',
        dateTo: '2016/02/13',
        rating: 3,
        useVenueOpeningTimes: false,
        costType: 'Free',
        summary: 'A Shakespearian classic',
        description: 'A contemporary update of this Shakespearian classic',
        venueId: testData.MINIMAL_VENUE_ID,
        version: 3,
        createdDate: '2016/01/10',
        updatedDate: '2016/01/11',
      })
      .then(response => expect(response).to.eql(expected))
      .then(() => done())
      .catch(done);
  });
});

describe('getEventForEdit', () => {
  afterEach(() => {
    dynamoDbClient.get.restore();
    dynamoDbClient.batchGet.restore();
  });

  it('should process get request with minimal related entities', done => {
    sinon.stub(dynamoDbClient, 'get').callsFake(params => {
      expect(params).to.eql({
        TableName: process.env.SERVERLESS_EVENT_TABLE_NAME,
        Key: { id: testData.PERFORMANCE_EVENT_ID },
        ConsistentRead: true,
        ReturnConsumedCapacity: undefined,
      });

      const dbItem = testData.createMinimalPerformanceDbEvent();
      dbItem.venueId = testData.MINIMAL_VENUE_ID;

      return Promise.resolve(dbItem);
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

    const expected = {
      id: testData.PERFORMANCE_EVENT_ID,
      status: 'Active',
      name: 'Taming of the Shrew',
      eventType: 'Performance',
      occurrenceType: 'Bounded',
      bookingType: 'NotRequired',
      dateFrom: '2016/02/11',
      dateTo: '2016/02/13',
      rating: 3,
      useVenueOpeningTimes: false,
      costType: 'Paid',
      summary: 'A Shakespearian classic',
      venue: {
        entityType: 'venue',
        id: testData.MINIMAL_VENUE_ID,
        name: 'Almeida Theatre',
        status: 'Active',
        venueType: 'Theatre',
        address: 'Almeida St\nIslington',
        postcode: 'N1 1TA',
        latitude: 51.539464,
        longitude: -0.103103,
        wheelchairAccessType: 'FullAccess',
        disabledBathroomType: 'Present',
        hearingFacilitiesType: 'HearingLoops',
        hasPermanentCollection: false,
      },
      createdDate: '2016/01/10',
      updatedDate: '2016/01/11',
      schemeVersion: eventConstants.CURRENT_EVENT_SCHEME_VERSION,
      version: 4,
    };

    eventService
      .getEventForEdit('almeida-theatre/2016/taming-of-the-shrew')
      .then(response => expect(response).to.eql(expected))
      .then(() => done())
      .catch(done);
  });

  it('should process get request with all related entities', done => {
    sinon.stub(dynamoDbClient, 'get').callsFake(params => {
      expect(params).to.eql({
        TableName: process.env.SERVERLESS_EVENT_TABLE_NAME,
        Key: { id: testData.PERFORMANCE_EVENT_ID },
        ConsistentRead: true,
        ReturnConsumedCapacity: undefined,
      });

      const dbItem = testData.createMinimalPerformanceDbEvent();
      dbItem.venueId = testData.MINIMAL_VENUE_ID;
      dbItem.eventSeriesId = testData.EVENT_SERIES_ID;

      dbItem.talents = [
        { id: testData.INDIVIDUAL_TALENT_ID, roles: ['Actor'] },
      ];

      return Promise.resolve(dbItem);
    });

    sinon.stub(dynamoDbClient, 'batchGet').callsFake(params => {
      expect(params).to.eql({
        RequestItems: {
          [process.env.SERVERLESS_TALENT_TABLE_NAME]: {
            Keys: [{ id: testData.INDIVIDUAL_TALENT_ID }],
            ConsistentRead: false,
          },
          [process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME]: {
            Keys: [{ id: testData.EVENT_SERIES_ID }],
            ConsistentRead: false,
          },
          [process.env.SERVERLESS_VENUE_TABLE_NAME]: {
            Keys: [{ id: testData.MINIMAL_VENUE_ID }],
            ConsistentRead: false,
          },
        },
        ReturnConsumedCapacity: undefined,
      });

      return Promise.resolve({
        Responses: {
          [process.env.SERVERLESS_TALENT_TABLE_NAME]: [
            testData.createMinimalIndividualDbTalent(),
          ],
          [process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME]: [
            testData.createMinimalDbEventSeries(),
          ],
          [process.env.SERVERLESS_VENUE_TABLE_NAME]: [
            testData.createMinimalDbVenue(),
          ],
        },
      });
    });

    const expected = {
      id: testData.PERFORMANCE_EVENT_ID,
      status: 'Active',
      name: 'Taming of the Shrew',
      eventType: 'Performance',
      occurrenceType: 'Bounded',
      bookingType: 'NotRequired',
      dateFrom: '2016/02/11',
      dateTo: '2016/02/13',
      rating: 3,
      useVenueOpeningTimes: false,
      costType: 'Paid',
      summary: 'A Shakespearian classic',
      venue: {
        entityType: 'venue',
        id: testData.MINIMAL_VENUE_ID,
        name: 'Almeida Theatre',
        status: 'Active',
        venueType: 'Theatre',
        address: 'Almeida St\nIslington',
        postcode: 'N1 1TA',
        latitude: 51.539464,
        longitude: -0.103103,
        wheelchairAccessType: 'FullAccess',
        disabledBathroomType: 'Present',
        hearingFacilitiesType: 'HearingLoops',
        hasPermanentCollection: false,
      },
      eventSeries: {
        entityType: 'event-series',
        id: testData.EVENT_SERIES_ID,
        name: 'Bang Said The Gun',
        status: 'Active',
        eventSeriesType: 'Occasional',
        occurrence: 'Third Thursday of each month',
        summary: 'A poetry riot',
        description: 'Poetry for people who dont like poetry.',
      },
      talents: [
        {
          entityType: 'talent',
          id: testData.INDIVIDUAL_TALENT_ID,
          firstNames: 'Carrie',
          lastName: 'Cracknell',
          status: 'Active',
          talentType: 'Individual',
          commonRole: 'Actor',
          roles: ['Actor'],
        },
      ],
      createdDate: '2016/01/10',
      updatedDate: '2016/01/11',
      schemeVersion: eventConstants.CURRENT_EVENT_SCHEME_VERSION,
      version: 4,
    };

    eventService
      .getEventForEdit('almeida-theatre/2016/taming-of-the-shrew')
      .then(response => expect(response).to.eql(expected))
      .then(() => done())
      .catch(done);
  });
});

describe('getEventMulti', () => {
  afterEach(() => {
    dynamoDbClient.batchGet.restore();
    populate.getReferencedEntitiesForSearch.restore();
  });

  it('should process get multiple request', done => {
    sinon.stub(dynamoDbClient, 'batchGet').callsFake(params => {
      expect(
        params.RequestItems[process.env.SERVERLESS_EVENT_TABLE_NAME].Keys
      ).to.eql([
        { id: 'tate-modern/2016/tate-modern-permanent-collection' },
        { id: 'serpentine-sackler-gallery/2016/zaha-hadid' },
      ]);

      return Promise.resolve({
        Responses: {
          [process.env.SERVERLESS_VENUE_TABLE_NAME]: [
            {
              id: 'tate-modern/2016/tate-modern-permanent-collection',
              venueId: testData.MINIMAL_VENUE_ID,
              eventSeriesId: testData.EVENT_SERIES_ID,
            },
            {
              id: 'serpentine-sackler-gallery/2016/zaha-hadid',
              venueId: testData.MINIMAL_VENUE_ID,
            },
          ],
        },
      });
    });

    sinon.stub(populate, 'getReferencedEntitiesForSearch').callsFake(() => {
      return Promise.resolve([
        {
          entity: { id: 'tate-modern/2016/tate-modern-permanent-collection' },
          referencedEntities: {
            eventSeries: [
              {
                id: testData.EVENT_SERIES_ID,
              },
            ],
            venue: [
              {
                id: testData.MINIMAL_VENUE_ID,
              },
            ],
          },
        },
        {
          entity: { id: 'serpentine-sackler-gallery/2016/zaha-hadid' },
          referencedEntities: {
            venue: [
              {
                id: testData.MINIMAL_VENUE_ID,
              },
            ],
          },
        },
      ]);
    });

    const expected = [
      {
        entityType: 'event',
        id: 'tate-modern/2016/tate-modern-permanent-collection',
        venueId: 'almeida-theatre',
      },
      {
        entityType: 'event',
        id: 'serpentine-sackler-gallery/2016/zaha-hadid',
        venueId: 'almeida-theatre',
      },
    ];

    eventService
      .getEventMulti([
        'tate-modern/2016/tate-modern-permanent-collection',
        'serpentine-sackler-gallery/2016/zaha-hadid',
      ])
      .then(response => expect(response).to.containSubset(expected))
      .then(() => done())
      .catch(done);
  });
});

describe('getEvent', () => {
  afterEach(() => {
    dynamoDbClient.get.restore();
    dynamoDbClient.batchGet.restore();
  });

  it('should process an admin get event request with minimal related entities', done => {
    sinon.stub(dynamoDbClient, 'get').callsFake(params => {
      expect(params).to.eql({
        TableName: process.env.SERVERLESS_EVENT_TABLE_NAME,
        Key: { id: testData.PERFORMANCE_EVENT_ID },
        ConsistentRead: true,
        ReturnConsumedCapacity: undefined,
      });

      const dbItem = testData.createMinimalPerformanceDbEvent();
      dbItem.venueId = testData.MINIMAL_VENUE_ID;

      return Promise.resolve(dbItem);
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

    const expected = {
      entityType: 'event',
      isFullEntity: true,
      id: testData.PERFORMANCE_EVENT_ID,
      status: 'Active',
      name: 'Taming of the Shrew',
      eventType: 'Performance',
      occurrenceType: 'Bounded',
      bookingType: 'NotRequired',
      dateFrom: '2016/02/11',
      dateTo: '2016/02/13',
      rating: 3,
      useVenueOpeningTimes: false,
      costType: 'Paid',
      summary: 'A Shakespearian classic',
      venueId: testData.EVENT_VENUE_ID,
      venueName: 'Almeida Theatre',
      postcode: 'N1 1TA',
      latitude: 51.539464,
      longitude: -0.103103,
      venue: {
        entityType: 'venue',
        id: testData.MINIMAL_VENUE_ID,
        name: 'Almeida Theatre',
        status: 'Active',
        venueType: 'Theatre',
        address: 'Almeida St\nIslington',
        postcode: 'N1 1TA',
        latitude: 51.539464,
        longitude: -0.103103,
        wheelchairAccessType: 'FullAccess',
        disabledBathroomType: 'Present',
        hearingFacilitiesType: 'HearingLoops',
        hasPermanentCollection: false,
      },
    };

    eventService
      .getEvent('almeida-theatre/2016/taming-of-the-shrew', false)
      .then(response => expect(response).to.eql(expected))
      .then(() => done())
      .catch(done);
  });

  it('should process a public get event request with all related entities', done => {
    sinon.stub(dynamoDbClient, 'get').callsFake(params => {
      expect(params).to.eql({
        TableName: process.env.SERVERLESS_EVENT_TABLE_NAME,
        Key: { id: testData.PERFORMANCE_EVENT_ID },
        ConsistentRead: false,
        ReturnConsumedCapacity: undefined,
      });

      const dbItem = testData.createMinimalPerformanceDbEvent();
      dbItem.venueId = testData.MINIMAL_VENUE_ID;
      dbItem.eventSeriesId = testData.EVENT_SERIES_ID;
      dbItem.talents = [
        { id: testData.INDIVIDUAL_TALENT_ID, roles: ['Actor'] },
      ];

      return Promise.resolve(dbItem);
    });

    sinon.stub(dynamoDbClient, 'batchGet').callsFake(params => {
      expect(params).to.eql({
        RequestItems: {
          [process.env.SERVERLESS_TALENT_TABLE_NAME]: {
            Keys: [{ id: testData.INDIVIDUAL_TALENT_ID }],
            ConsistentRead: false,
          },
          [process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME]: {
            Keys: [{ id: testData.EVENT_SERIES_ID }],
            ConsistentRead: false,
          },
          [process.env.SERVERLESS_VENUE_TABLE_NAME]: {
            Keys: [{ id: testData.MINIMAL_VENUE_ID }],
            ConsistentRead: false,
          },
        },
        ReturnConsumedCapacity: undefined,
      });

      return Promise.resolve({
        Responses: {
          [process.env.SERVERLESS_TALENT_TABLE_NAME]: [
            testData.createMinimalIndividualDbTalent(),
          ],
          [process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME]: [
            testData.createMinimalDbEventSeries(),
          ],
          [process.env.SERVERLESS_VENUE_TABLE_NAME]: [
            testData.createMinimalDbVenue(),
          ],
        },
      });
    });

    const expected = {
      entityType: 'event',
      isFullEntity: true,
      id: testData.PERFORMANCE_EVENT_ID,
      status: 'Active',
      name: 'Taming of the Shrew',
      eventType: 'Performance',
      occurrenceType: 'Bounded',
      bookingType: 'NotRequired',
      dateFrom: '2016/02/11',
      dateTo: '2016/02/13',
      rating: 3,
      useVenueOpeningTimes: false,
      costType: 'Paid',
      summary: 'A Shakespearian classic',
      description: 'Poetry for people who dont like poetry.',
      venueId: testData.EVENT_VENUE_ID,
      venueName: 'Almeida Theatre',
      postcode: 'N1 1TA',
      latitude: 51.539464,
      longitude: -0.103103,
      venue: {
        entityType: 'venue',
        id: testData.MINIMAL_VENUE_ID,
        name: 'Almeida Theatre',
        status: 'Active',
        venueType: 'Theatre',
        address: 'Almeida St\nIslington',
        postcode: 'N1 1TA',
        latitude: 51.539464,
        longitude: -0.103103,
        wheelchairAccessType: 'FullAccess',
        disabledBathroomType: 'Present',
        hearingFacilitiesType: 'HearingLoops',
        hasPermanentCollection: false,
      },
      eventSeries: {
        entityType: 'event-series',
        id: testData.EVENT_SERIES_ID,
        name: 'Bang Said The Gun',
        status: 'Active',
        eventSeriesType: 'Occasional',
        occurrence: 'Third Thursday of each month',
        summary: 'A poetry riot',
        description: 'Poetry for people who dont like poetry.',
      },
      talents: [
        {
          entityType: 'talent',
          id: testData.INDIVIDUAL_TALENT_ID,
          firstNames: 'Carrie',
          lastName: 'Cracknell',
          status: 'Active',
          talentType: 'Individual',
          commonRole: 'Actor',
          roles: ['Actor'],
        },
      ],
    };

    eventService
      .getEvent('almeida-theatre/2016/taming-of-the-shrew', true)
      .then(response => expect(response).to.eql(expected))
      .then(() => done())
      .catch(done);
  });
});
