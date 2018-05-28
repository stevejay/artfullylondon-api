"use strict";

const log = require("loglevel");
const venueIterationService = require("../../lib/services/venue-iteration-service");
const lambda = require("../../lib/external-services/lambda");
const sns = require("../../lib/external-services/sns");

process.env.SERVERLESS_START_ITERATION_LAMBDA_NAME = "StartIteration";
process.env.SERVERLESS_ITERATE_VENUES_TOPIC_ARN = "IterateVenuesTopicArn";
process.env.SERVERLESS_GET_NEXT_VENUE_LAMBDA_NAME = "GetNextVenue";
process.env.SERVERLESS_ADD_ITERATION_ERROR_LAMBDA_NAME = "AddIterationError";
process.env.SERVERLESS_END_ITERATION_LAMBDA_NAME = "EndIteration";

describe("venue-iteration-service", () => {
  describe("getNextVenue", () => {
    it("should get the next venue", async () => {
      lambda.invoke = jest.fn().mockResolvedValue({ venueId: "tate-modern" });

      const result = await venueIterationService.getNextVenue(
        "almeida-theatre"
      );

      expect(result).toEqual("tate-modern");

      expect(lambda.invoke).toHaveBeenCalledWith("GetNextVenue", {
        lastId: "almeida-theatre"
      });
    });

    it("should handle there being no next venue", async () => {
      lambda.invoke = jest.fn().mockResolvedValue(null);

      const result = await venueIterationService.getNextVenue(
        "almeida-theatre"
      );

      expect(result).toEqual(null);

      expect(lambda.invoke).toHaveBeenCalledWith("GetNextVenue", {
        lastId: "almeida-theatre"
      });
    });

    it("should get the next venue when last venue id is null", async () => {
      lambda.invoke = jest
        .fn()
        .mockResolvedValue({ venueId: "almeida-theatre" });

      const result = await venueIterationService.getNextVenue(null);

      expect(result).toEqual("almeida-theatre");

      expect(lambda.invoke).toHaveBeenCalledWith("GetNextVenue", {
        lastId: null
      });
    });
  });

  describe("startIteration", () => {
    it("should start an iteration", async () => {
      lambda.invoke = jest.fn().mockResolvedValue({ startTimestamp: 12345678 });
      sns.notify = jest.fn().mockResolvedValue();

      await venueIterationService.startIteration();

      expect(lambda.invoke).toHaveBeenCalledWith("StartIteration", {
        actionId: "IterateVenueMonitors"
      });

      expect(sns.notify).toHaveBeenCalledWith(
        {
          startTimestamp: 12345678,
          lastId: null,
          retry: 0
        },
        { arn: "IterateVenuesTopicArn" }
      );
    });
  });

  describe("throttleIteration", () => {
    it("should throttle when action executes quickly", async () => {
      const startTime = process.hrtime();
      await venueIterationService.throttleIteration(startTime, 250);
    });
  });

  describe("invokeNextIteration", () => {
    it("should add SNS when there is another venue to iterate", async () => {
      sns.notify = jest.fn().mockResolvedValue();

      await venueIterationService.invokeNextIteration(
        "almeida-theatre",
        123456
      );

      expect(sns.notify).toHaveBeenCalledWith({
        startTimestamp: 123456,
        lastId: "almeida-theatre",
        retry: 0
      });
    });

    it("should invoke end of iteration lambda when there are no more venues to iterate", async () => {
      lambda.invoke = jest.fn().mockResolvedValue();

      await venueIterationService.invokeNextIteration(null, 123456);

      expect(lambda.invoke.mock.calls[0][1]).toEqual({
        actionId: "IterateVenueMonitors",
        startTimestamp: 123456
      });
    });
  });

  describe("addIterationError", () => {
    it("should add the error", async () => {
      lambda.invoke = jest.fn().mockResolvedValue();
      log.error = jest.fn();

      await venueIterationService.addIterationError(
        new Error("foo"),
        "almeida-theatre",
        123456
      );

      expect(lambda.invoke.mock.calls[0][1]).toEqual({
        actionId: "IterateVenueMonitors",
        startTimestamp: 123456,
        entityId: "almeida-theatre",
        message: "foo"
      });

      expect(log.error).toHaveBeenCalled();
    });

    it("should handle an exception being thrown when adding the error", async () => {
      lambda.invoke = jest
        .fn()
        .mockRejectedValue(new Error("deliberately thrown"));

      log.error = jest.fn();

      await venueIterationService.addIterationError(
        new Error("foo"),
        "almeida-theatre",
        123456
      );

      expect(lambda.invoke).toHaveBeenCalled();
      expect(log.error).toHaveBeenCalled();
    });
  });
});
