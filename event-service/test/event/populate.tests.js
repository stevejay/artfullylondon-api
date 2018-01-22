'use strict';

const co = require('co');
const sinon = require('sinon');
const expect = require('chai').expect;
const dynamoDbClient = require('dynamodb-doc-client-wrapper');
const testData = require('../test-data');
const talentConstants = require('../../lib/talent/constants');
const venueConstants = require('../../lib/venue/constants');
const eventSeriesConstants = require('../../lib/event-series/constants');
const populate = require('../../lib/event/populate');

process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME = 'event-series-table';
process.env.SERVERLESS_TALENT_TABLE_NAME = 'talent-table';
process.env.SERVERLESS_VENUE_TABLE_NAME = 'venue-table';

describe('populate', () => {
  describe('getReferencedEntitiesForSearch', () => {
    afterEach(() => {
      dynamoDbClient.batchGet.restore();
    });

    it('should get references for an event with duplicate references', done => {
      const dbItemOne = {
        talents: [{ id: testData.INDIVIDUAL_TALENT_ID }],
        venueId: testData.MINIMAL_VENUE_ID,
        eventSeriesId: testData.EVENT_SERIES_ID
      };

      const dbItemTwo = {
        talents: [{ id: testData.INDIVIDUAL_TALENT_ID }],
        venueId: testData.MINIMAL_VENUE_ID,
        eventSeriesId: testData.EVENT_SERIES_ID
      };

      sinon.stub(dynamoDbClient, 'batchGet').callsFake(params => {
        try {
          expect(params).to.eql({
            RequestItems: {
              [process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME]: {
                Keys: [{ id: testData.EVENT_SERIES_ID }],
                ConsistentRead: true
              },
              [process.env.SERVERLESS_VENUE_TABLE_NAME]: {
                Keys: [{ id: testData.MINIMAL_VENUE_ID }],
                ConsistentRead: true
              }
            },
            ReturnConsumedCapacity: undefined
          });
        } catch (err) {
          return Promise.reject(new Error(err));
        }

        return Promise.resolve({
          Responses: {
            [process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME]: [
              testData.createMinimalDbEventSeries()
            ],
            [process.env.SERVERLESS_VENUE_TABLE_NAME]: [
              testData.createMinimalDbVenue()
            ]
          }
        });
      });

      const expected = [
        {
          entity: dbItemOne,
          referencedEntities: {
            eventSeries: [
              {
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
                updatedDate: '2016/01/11'
              }
            ],
            venue: [
              {
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
                version: 1,
                schemeVersion: venueConstants.CURRENT_VENUE_SCHEME_VERSION,
                createdDate: '2016/01/10',
                updatedDate: '2016/01/11'
              }
            ]
          }
        },
        {
          entity: dbItemTwo,
          referencedEntities: {
            eventSeries: [
              {
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
                updatedDate: '2016/01/11'
              }
            ],
            venue: [
              {
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
                version: 1,
                schemeVersion: venueConstants.CURRENT_VENUE_SCHEME_VERSION,
                createdDate: '2016/01/10',
                updatedDate: '2016/01/11'
              }
            ]
          }
        }
      ];

      co(
        populate.getReferencedEntitiesForSearch([dbItemOne, dbItemTwo], {
          ConsistentRead: true
        })
      )
        .then(response => {
          expect(response).to.eql(expected);
          done();
        })
        .catch(err => done(err));
    });

    it('should get references for an event with full references using consistent read', done => {
      const dbItem = {
        talents: [{ id: testData.INDIVIDUAL_TALENT_ID }],
        venueId: testData.MINIMAL_VENUE_ID,
        eventSeriesId: testData.EVENT_SERIES_ID
      };

      sinon.stub(dynamoDbClient, 'batchGet').callsFake(params => {
        try {
          expect(params).to.eql({
            RequestItems: {
              [process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME]: {
                Keys: [{ id: testData.EVENT_SERIES_ID }],
                ConsistentRead: true
              },
              [process.env.SERVERLESS_VENUE_TABLE_NAME]: {
                Keys: [{ id: testData.MINIMAL_VENUE_ID }],
                ConsistentRead: true
              }
            },
            ReturnConsumedCapacity: undefined
          });
        } catch (err) {
          return Promise.reject(new Error(err));
        }

        return Promise.resolve({
          Responses: {
            [process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME]: [
              testData.createMinimalDbEventSeries()
            ],
            [process.env.SERVERLESS_VENUE_TABLE_NAME]: [
              testData.createMinimalDbVenue()
            ]
          }
        });
      });

      const expected = [
        {
          entity: dbItem,
          referencedEntities: {
            eventSeries: [
              {
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
                updatedDate: '2016/01/11'
              }
            ],
            venue: [
              {
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
                version: 1,
                schemeVersion: venueConstants.CURRENT_VENUE_SCHEME_VERSION,
                createdDate: '2016/01/10',
                updatedDate: '2016/01/11'
              }
            ]
          }
        }
      ];

      co(
        populate.getReferencedEntitiesForSearch([dbItem], {
          ConsistentRead: true
        })
      )
        .then(response => {
          expect(response).to.eql(expected);
          done();
        })
        .catch(err => done(err));
    });

    it('should get references for an event with only venue not using consistent read', done => {
      const dbItem = {
        talents: [{ id: testData.INDIVIDUAL_TALENT_ID }],
        venueId: testData.MINIMAL_VENUE_ID
      };

      sinon.stub(dynamoDbClient, 'batchGet').callsFake(params => {
        try {
          expect(params).to.eql({
            RequestItems: {
              [process.env.SERVERLESS_VENUE_TABLE_NAME]: {
                Keys: [{ id: testData.MINIMAL_VENUE_ID }],
                ConsistentRead: false
              }
            },
            ReturnConsumedCapacity: undefined
          });
        } catch (err) {
          return Promise.reject(new Error(err));
        }

        return Promise.resolve({
          Responses: {
            [process.env.SERVERLESS_VENUE_TABLE_NAME]: [
              testData.createMinimalDbVenue()
            ]
          }
        });
      });

      const expected = [
        {
          entity: dbItem,
          referencedEntities: {
            eventSeries: [],
            venue: [
              {
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
                version: 1,
                schemeVersion: venueConstants.CURRENT_VENUE_SCHEME_VERSION,
                createdDate: '2016/01/10',
                updatedDate: '2016/01/11'
              }
            ]
          }
        }
      ];

      co(populate.getReferencedEntitiesForSearch([dbItem]))
        .then(response => {
          expect(response).to.eql(expected);
          done();
        })
        .catch(err => done(err));
    });
  });

  describe('getReferencedEntities', () => {
    afterEach(() => {
      dynamoDbClient.batchGet.restore();
    });

    it('should get references for an event with full references', done => {
      const dbItem = {
        talents: [{ id: testData.INDIVIDUAL_TALENT_ID }],
        venueId: testData.MINIMAL_VENUE_ID,
        eventSeriesId: testData.EVENT_SERIES_ID
      };

      sinon.stub(dynamoDbClient, 'batchGet').callsFake(params => {
        try {
          expect(params).to.eql({
            RequestItems: {
              [process.env.SERVERLESS_TALENT_TABLE_NAME]: {
                Keys: [{ id: testData.INDIVIDUAL_TALENT_ID }],
                ConsistentRead: false
              },
              [process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME]: {
                Keys: [{ id: testData.EVENT_SERIES_ID }],
                ConsistentRead: false
              },
              [process.env.SERVERLESS_VENUE_TABLE_NAME]: {
                Keys: [{ id: testData.MINIMAL_VENUE_ID }],
                ConsistentRead: false
              }
            },
            ReturnConsumedCapacity: undefined
          });
        } catch (err) {
          return Promise.reject(new Error(err));
        }

        return Promise.resolve({
          Responses: {
            [process.env.SERVERLESS_TALENT_TABLE_NAME]: [
              testData.createMinimalIndividualDbTalent()
            ],
            [process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME]: [
              testData.createMinimalDbEventSeries()
            ],
            [process.env.SERVERLESS_VENUE_TABLE_NAME]: [
              testData.createMinimalDbVenue()
            ]
          }
        });
      });

      const expected = {
        talent: [
          {
            id: testData.INDIVIDUAL_TALENT_ID,
            firstNames: 'Carrie',
            lastName: 'Cracknell',
            status: 'Active',
            talentType: 'Individual',
            commonRole: 'Actor',
            version: 3,
            schemeVersion: talentConstants.CURRENT_TALENT_SCHEME_VERSION,
            createdDate: '2016/01/10',
            updatedDate: '2016/01/11'
          }
        ],
        eventSeries: [
          {
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
            updatedDate: '2016/01/11'
          }
        ],
        venue: [
          {
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
            version: 1,
            schemeVersion: venueConstants.CURRENT_VENUE_SCHEME_VERSION,
            createdDate: '2016/01/10',
            updatedDate: '2016/01/11'
          }
        ]
      };

      co(populate.getReferencedEntities(dbItem))
        .then(response => {
          expect(response).to.eql(expected);
          done();
        })
        .catch(err => done(err));
    });

    it('should get references for an event with only a venue reference', done => {
      const dbItem = {
        venueId: testData.MINIMAL_VENUE_ID
      };

      sinon.stub(dynamoDbClient, 'batchGet').callsFake(params => {
        try {
          expect(params).to.eql({
            RequestItems: {
              [process.env.SERVERLESS_VENUE_TABLE_NAME]: {
                Keys: [{ id: testData.MINIMAL_VENUE_ID }],
                ConsistentRead: false
              }
            },
            ReturnConsumedCapacity: undefined
          });
        } catch (err) {
          return Promise.reject(new Error(err));
        }

        return Promise.resolve({
          Responses: {
            [process.env.SERVERLESS_VENUE_TABLE_NAME]: [
              testData.createMinimalDbVenue()
            ]
          }
        });
      });

      const expected = {
        talent: [],
        eventSeries: [],
        venue: [
          {
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
            version: 1,
            schemeVersion: venueConstants.CURRENT_VENUE_SCHEME_VERSION,
            createdDate: '2016/01/10',
            updatedDate: '2016/01/11'
          }
        ]
      };

      co(populate.getReferencedEntities(dbItem))
        .then(response => {
          expect(response).to.eql(expected);
          done();
        })
        .catch(err => done(err));
    });

    it('should get references for an event with only venue and event series references', done => {
      const dbItem = {
        venueId: testData.MINIMAL_VENUE_ID,
        eventSeriesId: testData.EVENT_SERIES_ID
      };

      sinon.stub(dynamoDbClient, 'batchGet').callsFake(params => {
        try {
          expect(params).to.eql({
            RequestItems: {
              [process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME]: {
                Keys: [{ id: testData.EVENT_SERIES_ID }],
                ConsistentRead: false
              },
              [process.env.SERVERLESS_VENUE_TABLE_NAME]: {
                Keys: [{ id: testData.MINIMAL_VENUE_ID }],
                ConsistentRead: false
              }
            },
            ReturnConsumedCapacity: undefined
          });
        } catch (err) {
          return Promise.reject(new Error(err));
        }

        return Promise.resolve({
          Responses: {
            [process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME]: [
              testData.createMinimalDbEventSeries()
            ],
            [process.env.SERVERLESS_VENUE_TABLE_NAME]: [
              testData.createMinimalDbVenue()
            ]
          }
        });
      });

      const expected = {
        talent: [],
        eventSeries: [
          {
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
            updatedDate: '2016/01/11'
          }
        ],
        venue: [
          {
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
            version: 1,
            schemeVersion: venueConstants.CURRENT_VENUE_SCHEME_VERSION,
            createdDate: '2016/01/10',
            updatedDate: '2016/01/11'
          }
        ]
      };

      co(populate.getReferencedEntities(dbItem))
        .then(response => {
          expect(response).to.eql(expected);
          done();
        })
        .catch(err => done(err));
    });

    it('should get references for an event with only venue and talent references', done => {
      const dbItem = {
        talents: [{ id: testData.INDIVIDUAL_TALENT_ID }],
        venueId: testData.MINIMAL_VENUE_ID
      };

      sinon.stub(dynamoDbClient, 'batchGet').callsFake(params => {
        try {
          expect(params).to.eql({
            RequestItems: {
              [process.env.SERVERLESS_TALENT_TABLE_NAME]: {
                Keys: [{ id: testData.INDIVIDUAL_TALENT_ID }],
                ConsistentRead: false
              },
              [process.env.SERVERLESS_VENUE_TABLE_NAME]: {
                Keys: [{ id: testData.MINIMAL_VENUE_ID }],
                ConsistentRead: false
              }
            },
            ReturnConsumedCapacity: undefined
          });
        } catch (err) {
          return Promise.reject(new Error(err));
        }

        return Promise.resolve({
          Responses: {
            [process.env.SERVERLESS_TALENT_TABLE_NAME]: [
              testData.createMinimalIndividualDbTalent()
            ],
            [process.env.SERVERLESS_VENUE_TABLE_NAME]: [
              testData.createMinimalDbVenue()
            ]
          }
        });
      });

      const expected = {
        talent: [
          {
            id: testData.INDIVIDUAL_TALENT_ID,
            firstNames: 'Carrie',
            lastName: 'Cracknell',
            status: 'Active',
            talentType: 'Individual',
            commonRole: 'Actor',
            version: 3,
            schemeVersion: talentConstants.CURRENT_TALENT_SCHEME_VERSION,
            createdDate: '2016/01/10',
            updatedDate: '2016/01/11'
          }
        ],
        eventSeries: [],
        venue: [
          {
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
            version: 1,
            schemeVersion: venueConstants.CURRENT_VENUE_SCHEME_VERSION,
            createdDate: '2016/01/10',
            updatedDate: '2016/01/11'
          }
        ]
      };

      co(populate.getReferencedEntities(dbItem))
        .then(response => {
          expect(response).to.eql(expected);
          done();
        })
        .catch(err => done(err));
    });
  });
});
