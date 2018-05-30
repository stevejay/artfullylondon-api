"use strict";

const sinon = require("sinon");
const chai = require("chai");
chai.use(require("chai-subset"));
const expect = chai.expect;
const dynamoDbClient = require("dynamodb-doc-client-wrapper");
const iterationRepository = require("../../lib/persistence/iteration-repository");

process.env.SERVERLESS_ITERATON_TABLE_NAME = "Iteration";

describe("iteration-repository", () => {
  describe("setIterationEndTimestamp", () => {
    afterEach(() => {
      dynamoDbClient.update.restore && dynamoDbClient.update.restore();
    });

    it("should set an iteration end timestamp", done => {
      sinon.stub(dynamoDbClient, "update").callsFake(param => {
        expect(param).toEqual(
          expect.objectContaining({
            TableName: process.env.SERVERLESS_ITERATON_TABLE_NAME,
            Key: { actionId: "some-action-id", startTimestamp: 12345678 },
            UpdateExpression: "set endTimestamp = :endTimestamp",
            ReturnConsumedCapacity: undefined
          })
        );

        expect(
          param.ExpressionAttributeValues[":endTimestamp"]
        ).to.be.greaterThan(0);

        return Promise.resolve();
      });

      iterationRepository
        .setIterationEndTimestamp("some-action-id", 12345678)
        .then(() => done())
        .catch(done);
    });
  });

  describe("addIteration", () => {
    afterEach(() => {
      dynamoDbClient.put.restore && dynamoDbClient.put.restore();
    });

    it("should add an iteration", done => {
      sinon.stub(dynamoDbClient, "put").callsFake(param => {
        expect(param).toEqual({
          TableName: process.env.SERVERLESS_ITERATON_TABLE_NAME,
          Item: { id: "some-id" },
          ReturnConsumedCapacity: undefined
        });

        return Promise.resolve();
      });

      iterationRepository
        .addIteration({ id: "some-id" })
        .then(() => done())
        .catch(done);
    });
  });

  describe("getMostRecentIteration", () => {
    afterEach(() => {
      dynamoDbClient.query.restore && dynamoDbClient.query.restore();
    });

    it("should get the most recent iteration", done => {
      sinon.stub(dynamoDbClient, "queryBasic").callsFake(param => {
        expect(param).toEqual({
          TableName: process.env.SERVERLESS_ITERATON_TABLE_NAME,
          KeyConditionExpression: "actionId = :actionId",
          ExpressionAttributeValues: { ":actionId": "some-action-id" },
          Limit: 1,
          ScanIndexForward: false,
          ProjectionExpression: "startTimestamp",
          ReturnConsumedCapacity: undefined
        });

        return Promise.resolve({ Items: [{ id: "some-id" }] });
      });

      iterationRepository
        .getMostRecentIteration("some-action-id")
        .then(response => {
          expect(response).toEqual({ Items: [{ id: "some-id" }] });
          done();
        })
        .catch(done);
    });
  });
});
