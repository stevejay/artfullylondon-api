"use strict";

const dynamodb = require("../external-services/dynamodb");
const testData = require("../test-data");
const talentConstants = require("../talent/constants");
import * as venueMapper from "../venue/mapper";
const eventSeriesConstants = require("../event-series/constants");
const populate = require("./populate");

process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME = "event-series-table";
process.env.SERVERLESS_TALENT_TABLE_NAME = "talent-table";
process.env.SERVERLESS_VENUE_TABLE_NAME = "venue-table";

describe("populate", () => {
  describe("getReferencedEntitiesForSearch", () => {
    it("should get references for an event with duplicate references", async () => {
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

      dynamodb.batchGet = jest.fn().mockResolvedValue({
        Responses: {
          [process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME]: [
            testData.createMinimalDbEventSeries()
          ],
          [process.env.SERVERLESS_VENUE_TABLE_NAME]: [
            testData.createMinimalDbVenue()
          ]
        }
      });

      const expected = [
        {
          entity: dbItemOne,
          referencedEntities: {
            eventSeries: [
              {
                id: testData.EVENT_SERIES_ID,
                name: "Bang Said The Gun",
                status: "Active",
                eventSeriesType: "Occasional",
                occurrence: "Third Thursday of each month",
                summary: "A poetry riot",
                description: "Poetry for people who dont like poetry.",
                version: 1,
                schemeVersion:
                  eventSeriesConstants.CURRENT_EVENT_SERIES_SCHEME_VERSION,
                createdDate: "2016/01/10",
                updatedDate: "2016/01/11"
              }
            ],
            venue: [
              {
                id: testData.MINIMAL_VENUE_ID,
                name: "Almeida Theatre",
                status: "Active",
                venueType: "Theatre",
                address: "Almeida St\nIslington",
                postcode: "N1 1TA",
                latitude: 51.539464,
                longitude: -0.103103,
                wheelchairAccessType: "FullAccess",
                disabledBathroomType: "Present",
                hearingFacilitiesType: "HearingLoops",
                version: 1,
                schemeVersion: venueMapper.CURRENT_VENUE_SCHEME_VERSION,
                createdDate: "2016/01/10",
                updatedDate: "2016/01/11"
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
                name: "Bang Said The Gun",
                status: "Active",
                eventSeriesType: "Occasional",
                occurrence: "Third Thursday of each month",
                summary: "A poetry riot",
                description: "Poetry for people who dont like poetry.",
                version: 1,
                schemeVersion:
                  eventSeriesConstants.CURRENT_EVENT_SERIES_SCHEME_VERSION,
                createdDate: "2016/01/10",
                updatedDate: "2016/01/11"
              }
            ],
            venue: [
              {
                id: testData.MINIMAL_VENUE_ID,
                name: "Almeida Theatre",
                status: "Active",
                venueType: "Theatre",
                address: "Almeida St\nIslington",
                postcode: "N1 1TA",
                latitude: 51.539464,
                longitude: -0.103103,
                wheelchairAccessType: "FullAccess",
                disabledBathroomType: "Present",
                hearingFacilitiesType: "HearingLoops",
                version: 1,
                schemeVersion: venueMapper.CURRENT_VENUE_SCHEME_VERSION,
                createdDate: "2016/01/10",
                updatedDate: "2016/01/11"
              }
            ]
          }
        }
      ];

      const response = await populate.getReferencedEntitiesForSearch(
        [dbItemOne, dbItemTwo],
        {
          ConsistentRead: true
        }
      );

      expect(response).toEqual(expected);

      expect(dynamodb.batchGet).toHaveBeenCalledWith({
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
    });

    it("should get references for an event with full references using consistent read", async () => {
      const dbItem = {
        talents: [{ id: testData.INDIVIDUAL_TALENT_ID }],
        venueId: testData.MINIMAL_VENUE_ID,
        eventSeriesId: testData.EVENT_SERIES_ID
      };

      dynamodb.batchGet = jest.fn().mockResolvedValue({
        Responses: {
          [process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME]: [
            testData.createMinimalDbEventSeries()
          ],
          [process.env.SERVERLESS_VENUE_TABLE_NAME]: [
            testData.createMinimalDbVenue()
          ]
        }
      });

      const expected = [
        {
          entity: dbItem,
          referencedEntities: {
            eventSeries: [
              {
                id: testData.EVENT_SERIES_ID,
                name: "Bang Said The Gun",
                status: "Active",
                eventSeriesType: "Occasional",
                occurrence: "Third Thursday of each month",
                summary: "A poetry riot",
                description: "Poetry for people who dont like poetry.",
                version: 1,
                schemeVersion:
                  eventSeriesConstants.CURRENT_EVENT_SERIES_SCHEME_VERSION,
                createdDate: "2016/01/10",
                updatedDate: "2016/01/11"
              }
            ],
            venue: [
              {
                id: testData.MINIMAL_VENUE_ID,
                name: "Almeida Theatre",
                status: "Active",
                venueType: "Theatre",
                address: "Almeida St\nIslington",
                postcode: "N1 1TA",
                latitude: 51.539464,
                longitude: -0.103103,
                wheelchairAccessType: "FullAccess",
                disabledBathroomType: "Present",
                hearingFacilitiesType: "HearingLoops",
                version: 1,
                schemeVersion: venueMapper.CURRENT_VENUE_SCHEME_VERSION,
                createdDate: "2016/01/10",
                updatedDate: "2016/01/11"
              }
            ]
          }
        }
      ];

      const response = await populate.getReferencedEntitiesForSearch([dbItem], {
        ConsistentRead: true
      });

      expect(response).toEqual(expected);

      expect(dynamodb.batchGet).toHaveBeenCalledWith({
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
    });

    it("should get references for an event with only venue not using consistent read", async () => {
      const dbItem = {
        talents: [{ id: testData.INDIVIDUAL_TALENT_ID }],
        venueId: testData.MINIMAL_VENUE_ID
      };

      dynamodb.batchGet = jest.fn().mockResolvedValue({
        Responses: {
          [process.env.SERVERLESS_VENUE_TABLE_NAME]: [
            testData.createMinimalDbVenue()
          ]
        }
      });

      const expected = [
        {
          entity: dbItem,
          referencedEntities: {
            eventSeries: [],
            venue: [
              {
                id: testData.MINIMAL_VENUE_ID,
                name: "Almeida Theatre",
                status: "Active",
                venueType: "Theatre",
                address: "Almeida St\nIslington",
                postcode: "N1 1TA",
                latitude: 51.539464,
                longitude: -0.103103,
                wheelchairAccessType: "FullAccess",
                disabledBathroomType: "Present",
                hearingFacilitiesType: "HearingLoops",
                version: 1,
                schemeVersion: venueMapper.CURRENT_VENUE_SCHEME_VERSION,
                createdDate: "2016/01/10",
                updatedDate: "2016/01/11"
              }
            ]
          }
        }
      ];

      const response = await populate.getReferencedEntitiesForSearch([dbItem]);

      expect(response).toEqual(expected);

      expect(dynamodb.batchGet).toHaveBeenCalledWith({
        RequestItems: {
          [process.env.SERVERLESS_VENUE_TABLE_NAME]: {
            Keys: [{ id: testData.MINIMAL_VENUE_ID }],
            ConsistentRead: false
          }
        },
        ReturnConsumedCapacity: undefined
      });
    });
  });

  describe("getReferencedEntities", () => {
    it("should get references for an event with full references", async () => {
      const dbItem = {
        talents: [{ id: testData.INDIVIDUAL_TALENT_ID }],
        venueId: testData.MINIMAL_VENUE_ID,
        eventSeriesId: testData.EVENT_SERIES_ID
      };

      dynamodb.batchGet = jest.fn().mockResolvedValue({
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

      const expected = {
        talent: [
          {
            id: testData.INDIVIDUAL_TALENT_ID,
            firstNames: "Carrie",
            lastName: "Cracknell",
            status: "Active",
            talentType: "Individual",
            commonRole: "Actor",
            version: 3,
            schemeVersion: talentConstants.CURRENT_TALENT_SCHEME_VERSION,
            createdDate: "2016/01/10",
            updatedDate: "2016/01/11"
          }
        ],
        eventSeries: [
          {
            id: testData.EVENT_SERIES_ID,
            name: "Bang Said The Gun",
            status: "Active",
            eventSeriesType: "Occasional",
            occurrence: "Third Thursday of each month",
            summary: "A poetry riot",
            description: "Poetry for people who dont like poetry.",
            version: 1,
            schemeVersion:
              eventSeriesConstants.CURRENT_EVENT_SERIES_SCHEME_VERSION,
            createdDate: "2016/01/10",
            updatedDate: "2016/01/11"
          }
        ],
        venue: [
          {
            id: testData.MINIMAL_VENUE_ID,
            name: "Almeida Theatre",
            status: "Active",
            venueType: "Theatre",
            address: "Almeida St\nIslington",
            postcode: "N1 1TA",
            latitude: 51.539464,
            longitude: -0.103103,
            wheelchairAccessType: "FullAccess",
            disabledBathroomType: "Present",
            hearingFacilitiesType: "HearingLoops",
            version: 1,
            schemeVersion: venueMapper.CURRENT_VENUE_SCHEME_VERSION,
            createdDate: "2016/01/10",
            updatedDate: "2016/01/11"
          }
        ]
      };

      const response = await populate.getReferencedEntities(dbItem);
      expect(response).toEqual(expected);

      expect(dynamodb.batchGet).toHaveBeenCalledWith({
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
    });

    it("should get references for an event with only a venue reference", async () => {
      const dbItem = {
        venueId: testData.MINIMAL_VENUE_ID
      };

      dynamodb.batchGet = jest.fn().mockResolvedValue({
        Responses: {
          [process.env.SERVERLESS_VENUE_TABLE_NAME]: [
            testData.createMinimalDbVenue()
          ]
        }
      });

      const expected = {
        talent: [],
        eventSeries: [],
        venue: [
          {
            id: testData.MINIMAL_VENUE_ID,
            name: "Almeida Theatre",
            status: "Active",
            venueType: "Theatre",
            address: "Almeida St\nIslington",
            postcode: "N1 1TA",
            latitude: 51.539464,
            longitude: -0.103103,
            wheelchairAccessType: "FullAccess",
            disabledBathroomType: "Present",
            hearingFacilitiesType: "HearingLoops",
            version: 1,
            schemeVersion: venueMapper.CURRENT_VENUE_SCHEME_VERSION,
            createdDate: "2016/01/10",
            updatedDate: "2016/01/11"
          }
        ]
      };

      const response = await populate.getReferencedEntities(dbItem);
      expect(response).toEqual(expected);

      expect(dynamodb.batchGet).toHaveBeenCalledWith({
        RequestItems: {
          [process.env.SERVERLESS_VENUE_TABLE_NAME]: {
            Keys: [{ id: testData.MINIMAL_VENUE_ID }],
            ConsistentRead: false
          }
        },
        ReturnConsumedCapacity: undefined
      });
    });

    it("should get references for an event with only venue and event series references", async () => {
      const dbItem = {
        venueId: testData.MINIMAL_VENUE_ID,
        eventSeriesId: testData.EVENT_SERIES_ID
      };

      dynamodb.batchGet = jest.fn().mockResolvedValue({
        Responses: {
          [process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME]: [
            testData.createMinimalDbEventSeries()
          ],
          [process.env.SERVERLESS_VENUE_TABLE_NAME]: [
            testData.createMinimalDbVenue()
          ]
        }
      });

      const expected = {
        talent: [],
        eventSeries: [
          {
            id: testData.EVENT_SERIES_ID,
            name: "Bang Said The Gun",
            status: "Active",
            eventSeriesType: "Occasional",
            occurrence: "Third Thursday of each month",
            summary: "A poetry riot",
            description: "Poetry for people who dont like poetry.",
            version: 1,
            schemeVersion:
              eventSeriesConstants.CURRENT_EVENT_SERIES_SCHEME_VERSION,
            createdDate: "2016/01/10",
            updatedDate: "2016/01/11"
          }
        ],
        venue: [
          {
            id: testData.MINIMAL_VENUE_ID,
            name: "Almeida Theatre",
            status: "Active",
            venueType: "Theatre",
            address: "Almeida St\nIslington",
            postcode: "N1 1TA",
            latitude: 51.539464,
            longitude: -0.103103,
            wheelchairAccessType: "FullAccess",
            disabledBathroomType: "Present",
            hearingFacilitiesType: "HearingLoops",
            version: 1,
            schemeVersion: venueMapper.CURRENT_VENUE_SCHEME_VERSION,
            createdDate: "2016/01/10",
            updatedDate: "2016/01/11"
          }
        ]
      };

      const response = await populate.getReferencedEntities(dbItem);
      expect(response).toEqual(expected);

      expect(dynamodb.batchGet).toHaveBeenCalledWith({
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
    });

    it("should get references for an event with only venue and talent references", async () => {
      const dbItem = {
        talents: [{ id: testData.INDIVIDUAL_TALENT_ID }],
        venueId: testData.MINIMAL_VENUE_ID
      };

      dynamodb.batchGet = jest.fn().mockResolvedValue({
        Responses: {
          [process.env.SERVERLESS_TALENT_TABLE_NAME]: [
            testData.createMinimalIndividualDbTalent()
          ],
          [process.env.SERVERLESS_VENUE_TABLE_NAME]: [
            testData.createMinimalDbVenue()
          ]
        }
      });

      const expected = {
        talent: [
          {
            id: testData.INDIVIDUAL_TALENT_ID,
            firstNames: "Carrie",
            lastName: "Cracknell",
            status: "Active",
            talentType: "Individual",
            commonRole: "Actor",
            version: 3,
            schemeVersion: talentConstants.CURRENT_TALENT_SCHEME_VERSION,
            createdDate: "2016/01/10",
            updatedDate: "2016/01/11"
          }
        ],
        eventSeries: [],
        venue: [
          {
            id: testData.MINIMAL_VENUE_ID,
            name: "Almeida Theatre",
            status: "Active",
            venueType: "Theatre",
            address: "Almeida St\nIslington",
            postcode: "N1 1TA",
            latitude: 51.539464,
            longitude: -0.103103,
            wheelchairAccessType: "FullAccess",
            disabledBathroomType: "Present",
            hearingFacilitiesType: "HearingLoops",
            version: 1,
            schemeVersion: venueMapper.CURRENT_VENUE_SCHEME_VERSION,
            createdDate: "2016/01/10",
            updatedDate: "2016/01/11"
          }
        ]
      };

      const response = await populate.getReferencedEntities(dbItem);
      expect(response).toEqual(expected);

      expect(dynamodb.batchGet).toHaveBeenCalledWith({
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
    });
  });
});
