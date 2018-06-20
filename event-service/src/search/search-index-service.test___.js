// "use strict";

// const moment = require("moment");
// const dynamodb = require("../external-services/dynamodb");
// const sns = require("../external-services/sns");
// const entity = require("../entity/entity");
// const testData = require("../../tests/utils/test-data");
// const searchIndexService = require("./search-index-service");
// const etag = require("../lambda/etag");

// process.env.SERVERLESS_REFRESH_SEARCH_INDEX_TOPIC_ARN = "refresh-search-index";
// process.env.SERVERLESS_TALENT_TABLE_NAME = "talent-table";
// process.env.SERVERLESS_VENUE_TABLE_NAME = "venue-table";
// process.env.SERVERLESS_EVENT_TABLE_NAME = "event-table";
// process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME = "event-series-table";

// const sync = fn =>
//   fn.then(res => () => res).catch(err => () => {
//     throw err;
//   });

// describe("processRefreshSearchIndexMessage", () => {
//   it("should refresh talents in the talent full index when multiple scans are required", async () => {
//     dynamodb.scanBasic = jest.fn().mockResolvedValue({
//       Items: [testData.createMinimalIndividualDbTalent()],
//       LastEvaluatedKey: "some-talent"
//     });

//     dynamodb.batchGet = jest.fn();
//     sns.notify = jest.fn().mockResolvedValue();

//     await searchIndexService.processRefreshSearchIndexMessage({
//       index: "talent",
//       version: 10,
//       entity: "talent",
//       exclusiveStartKey: null
//     });

//     expect(dynamodb.scanBasic).toHaveBeenCalledWith({
//       TableName: process.env.SERVERLESS_TALENT_TABLE_NAME,
//       ExclusiveStartKey: null,
//       Limit: 30,
//       ConsistentRead: false
//     });

//     expect(dynamodb.batchGet).not.toHaveBeenCalled();

//     expect(sns.notify).toHaveBeenCalledWith(
//       {
//         index: "talent",
//         version: 10,
//         entity: "talent",
//         exclusiveStartKey: "some-talent"
//       },
//       { arn: "refresh-search-index" }
//     );
//   });

//   it("should refresh talents in the talent full index when no index version is specified", async () => {
//     dynamodb.scanBasic = jest.fn().mockResolvedValue({
//       Items: [testData.createMinimalIndividualDbTalent()]
//     });

//     dynamodb.batchGet = jest.fn();
//     sns.notify = jest.fn();

//     await searchIndexService.processRefreshSearchIndexMessage({
//       index: "talent",
//       version: undefined,
//       entity: "talent",
//       exclusiveStartKey: null
//     });

//     expect(dynamodb.scanBasic).toHaveBeenCalledWith({
//       TableName: process.env.SERVERLESS_TALENT_TABLE_NAME,
//       ExclusiveStartKey: null,
//       Limit: 30,
//       ConsistentRead: false
//     });

//     expect(dynamodb.batchGet).not.toHaveBeenCalled();
//     expect(sns.notify).not.toHaveBeenCalled();
//   });

//   it("should refresh talents in the talent full index", async () => {
//     dynamodb.scanBasic = jest.fn().mockResolvedValue({
//       Items: [testData.createMinimalIndividualDbTalent()]
//     });

//     dynamodb.batchGet = jest.fn();
//     sns.notify = jest.fn();

//     await searchIndexService.processRefreshSearchIndexMessage({
//       index: "talent",
//       version: 10,
//       entity: "talent",
//       exclusiveStartKey: null
//     });

//     expect(dynamodb.scanBasic).toHaveBeenCalledWith({
//       TableName: process.env.SERVERLESS_TALENT_TABLE_NAME,
//       ExclusiveStartKey: null,
//       Limit: 30,
//       ConsistentRead: false
//     });

//     expect(dynamodb.batchGet).not.toHaveBeenCalled();
//     expect(sns.notify).not.toHaveBeenCalled();
//   });

//   it("should refresh talents in the talent auto index", async () => {
//     dynamodb.scanBasic = jest.fn().mockResolvedValue({
//       Items: [testData.createMinimalIndividualDbTalent()]
//     });

//     dynamodb.batchGet = jest.fn();
//     sns.notify = jest.fn();

//     await searchIndexService.processRefreshSearchIndexMessage({
//       index: "autocomplete",
//       version: 10,
//       entity: "talent",
//       exclusiveStartKey: null
//     });

//     expect(dynamodb.scanBasic).toHaveBeenCalledWith({
//       TableName: process.env.SERVERLESS_TALENT_TABLE_NAME,
//       ExclusiveStartKey: null,
//       Limit: 30,
//       ConsistentRead: false
//     });

//     expect(dynamodb.batchGet).not.toHaveBeenCalled();
//     expect(sns.notify).not.toHaveBeenCalled();
//   });

//   it("should refresh venues in the venue full index", async () => {
//     dynamodb.scanBasic = jest.fn().mockResolvedValue({
//       Items: [testData.createMinimalDbVenue()]
//     });

//     dynamodb.batchGet = jest.fn();
//     sns.notify = jest.fn();

//     await searchIndexService.processRefreshSearchIndexMessage({
//       index: "venue",
//       version: 10,
//       entity: "venue",
//       exclusiveStartKey: null
//     });

//     expect(dynamodb.scanBasic).toHaveBeenCalledWith({
//       TableName: process.env.SERVERLESS_VENUE_TABLE_NAME,
//       ExclusiveStartKey: null,
//       Limit: 30,
//       ConsistentRead: false
//     });

//     expect(dynamodb.batchGet).not.toHaveBeenCalled();
//     expect(sns.notify).not.toHaveBeenCalled();
//   });

//   it("should refresh venues in the venue auto index", async () => {
//     dynamodb.scanBasic = jest.fn().mockResolvedValue({
//       Items: [testData.createMinimalDbVenue()]
//     });

//     dynamodb.batchGet = jest.fn();
//     sns.notify = jest.fn();

//     await searchIndexService.processRefreshSearchIndexMessage({
//       index: "autocomplete",
//       version: 10,
//       entity: "venue",
//       exclusiveStartKey: null
//     });

//     expect(dynamodb.scanBasic).toHaveBeenCalledWith({
//       TableName: process.env.SERVERLESS_VENUE_TABLE_NAME,
//       ExclusiveStartKey: null,
//       Limit: 30,
//       ConsistentRead: false
//     });

//     expect(dynamodb.batchGet).not.toHaveBeenCalled();
//     expect(sns.notify).not.toHaveBeenCalled();
//   });

//   it("should refresh event series in the event series full index", async () => {
//     dynamodb.scanBasic = jest.fn().mockResolvedValue({
//       Items: [testData.createMinimalDbEventSeries()]
//     });

//     dynamodb.batchGet = jest.fn();
//     sns.notify = jest.fn();

//     await searchIndexService.processRefreshSearchIndexMessage({
//       index: "event-series",
//       version: 10,
//       entity: "event-series",
//       exclusiveStartKey: null
//     });

//     expect(dynamodb.scanBasic).toHaveBeenCalledWith({
//       TableName: process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME,
//       ExclusiveStartKey: null,
//       Limit: 30,
//       ConsistentRead: false
//     });

//     expect(dynamodb.batchGet).not.toHaveBeenCalled();
//     expect(sns.notify).not.toHaveBeenCalled();
//   });

//   it("should refresh event series in the event series auto index", async () => {
//     dynamodb.scanBasic = jest.fn().mockResolvedValue({
//       Items: [testData.createMinimalDbEventSeries()]
//     });

//     dynamodb.batchGet = jest.fn();
//     sns.notify = jest.fn();

//     await searchIndexService.processRefreshSearchIndexMessage({
//       index: "autocomplete",
//       version: 10,
//       entity: "event-series",
//       exclusiveStartKey: null
//     });

//     expect(dynamodb.scanBasic).toHaveBeenCalledWith({
//       TableName: process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME,
//       ExclusiveStartKey: null,
//       Limit: 30,
//       ConsistentRead: false
//     });

//     expect(dynamodb.batchGet).not.toHaveBeenCalled();
//     expect(sns.notify).not.toHaveBeenCalled();
//   });

//   it("should refresh events in the event full index", async () => {
//     const dbEvent = testData.createMinimalPerformanceDbEvent();
//     dbEvent.venueId = testData.MINIMAL_VENUE_ID;
//     dynamodb.scanBasic = jest.fn().mockResolvedValue({ Items: [dbEvent] });

//     dynamodb.batchGet = jest.fn().mockResolvedValue({
//       Responses: {
//         [process.env.SERVERLESS_VENUE_TABLE_NAME]: [
//           testData.createMinimalDbVenue()
//         ]
//       }
//     });

//     sns.notify = jest.fn();

//     await searchIndexService.processRefreshSearchIndexMessage({
//       index: "event",
//       version: 10,
//       entity: "event",
//       exclusiveStartKey: null
//     });

//     expect(dynamodb.scanBasic).toHaveBeenCalledWith({
//       TableName: process.env.SERVERLESS_EVENT_TABLE_NAME,
//       ExclusiveStartKey: null,
//       Limit: 30,
//       ConsistentRead: false
//     });

//     expect(dynamodb.batchGet).toHaveBeenCalledWith({
//       RequestItems: {
//         [process.env.SERVERLESS_VENUE_TABLE_NAME]: {
//           Keys: [{ id: testData.MINIMAL_VENUE_ID }],
//           ConsistentRead: false
//         }
//       },
//       ReturnConsumedCapacity: undefined
//     });

//     expect(sns.notify).not.toHaveBeenCalled();
//   });
// });

// describe("refreshSearchIndex", () => {
//   it("should throw an error when request is invalid", async () => {
//     expect(
//       await sync(
//         searchIndexService.refreshSearchIndex({
//           index: "Foo",
//           version: "latest"
//         })
//       )
//     ).toThrow();
//   });

//   it("should handle the refresh of an index when latest index version is specified", async () => {
//     sns.notify = jest.fn().mockResolvedValue();

//     await searchIndexService.refreshSearchIndex({
//       index: "talent",
//       version: "latest"
//     });

//     expect(sns.notify).toHaveBeenCalledWith(
//       {
//         index: "talent",
//         version: null,
//         entity: "talent",
//         exclusiveStartKey: null
//       },
//       { arn: "refresh-search-index" }
//     );
//   });

//   it("should handle the refresh of the talent full index", async () => {
//     sns.notify = jest.fn().mockResolvedValue();

//     await searchIndexService.refreshSearchIndex({
//       index: "talent",
//       version: 10
//     });

//     expect(sns.notify).toHaveBeenCalledWith(
//       {
//         index: "talent",
//         version: 10,
//         entity: "talent",
//         exclusiveStartKey: null
//       },
//       { arn: "refresh-search-index" }
//     );
//   });

//   it("should handle the refresh of the talent auto index", async () => {
//     sns.notify = jest.fn().mockResolvedValue();

//     await searchIndexService.refreshSearchIndex({
//       index: "autocomplete",
//       version: 10
//     });

//     expect(sns.notify).toHaveBeenCalledWith(
//       {
//         index: "autocomplete",
//         version: 10,
//         entity: "talent",
//         exclusiveStartKey: null
//       },
//       { arn: "refresh-search-index" }
//     );
//   });

//   it("should handle the refresh of the combined event auto index", async () => {
//     sns.notify = jest.fn().mockResolvedValue();

//     await searchIndexService.refreshSearchIndex({
//       index: "autocomplete",
//       version: 10
//     });

//     expect(sns.notify).toHaveBeenCalledTimes(2);

//     expect(sns.notify).toHaveBeenCalledWith(
//       {
//         index: "autocomplete",
//         version: 10,
//         entity: "event",
//         exclusiveStartKey: null
//       },
//       { arn: "refresh-search-index" }
//     );

//     expect(sns.notify).toHaveBeenCalledWith(
//       {
//         index: "autocomplete",
//         version: 10,
//         entity: "event-series",
//         exclusiveStartKey: null
//       },
//       { arn: "refresh-search-index" }
//     );
//   });
// });

// describe("updateEventSearchIndex", () => {
//   it("should update an event in the event search indexes", async () => {
//     const futureDate = moment
//       .utc()
//       .startOf("day")
//       .add(10, "days")
//       .format("yyyy-MM-dd");

//     const dbItem = testData.createMinimalPerformanceDbEvent();
//     dbItem.venueId = testData.MINIMAL_VENUE_ID;
//     dbItem.occurrenceType = "Occasional";
//     delete dbItem.dateFrom;
//     delete dbItem.dateTo;

//     dbItem.additionalPerformances = [
//       { date: futureDate, at: "18:00" },
//       { date: futureDate, at: "19:00" },
//       { date: futureDate, at: "20:00" }
//     ];

//     dbItem.specialPerformances = [
//       {
//         date: futureDate,
//         at: "18:00",
//         audienceTags: [{ id: "audience/family", label: "family" }]
//       },
//       {
//         date: futureDate,
//         at: "19:00",
//         audienceTags: [
//           { id: "audience/teenagers", label: "teenagers" },
//           { id: "audience/family", label: "family" }
//         ]
//       }
//     ];

//     entity.get = jest.fn().mockResolvedValue(dbItem);

//     dynamodb.batchGet = jest.fn().mockResolvedValue({
//       Responses: {
//         [process.env.SERVERLESS_VENUE_TABLE_NAME]: [
//           testData.createMinimalDbVenue()
//         ]
//       }
//     });

//     etag.writeETagToRedis = jest.fn().mockResolvedValue();

//     await searchIndexService.updateEventSearchIndex({
//       eventId: testData.PERFORMANCE_EVENT_ID
//     });

//     expect(entity.get).toHaveBeenCalledWith(
//       process.env.SERVERLESS_EVENT_TABLE_NAME,
//       testData.PERFORMANCE_EVENT_ID,
//       true
//     );

//     expect(dynamodb.batchGet).toHaveBeenCalledWith({
//       RequestItems: {
//         [process.env.SERVERLESS_VENUE_TABLE_NAME]: {
//           Keys: [{ id: testData.MINIMAL_VENUE_ID }],
//           ConsistentRead: true
//         }
//       },
//       ReturnConsumedCapacity: undefined
//     });

//     expect(etag.writeETagToRedis).toHaveBeenCalled();
//   });
// });
