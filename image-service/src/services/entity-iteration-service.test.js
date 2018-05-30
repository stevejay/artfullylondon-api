"use strict";

const entityIterationService = require("./entity-iteration-service");
const lambda = require("../external-services/lambda");
const sns = require("../external-services/sns");
const log = require("loglevel");

process.env.SERVERLESS_START_ITERATION_LAMBDA_NAME = "StartIteration";
process.env.SERVERLESS_ADD_ITERATION_ERROR_LAMBDA_NAME = "AddIterationError";
process.env.SERVERLESS_END_ITERATION_LAMBDA_NAME = "EndIteration";

describe("entity-iteration-service", () => {
  describe("startIteration", () => {
    it("should start an iteration", async () => {
      lambda.invoke = jest.fn().mockResolvedValue({ startTimestamp: 12345678 });
      sns.notify = jest.fn().mockResolvedValue();

      await entityIterationService.startIteration(
        "SomeActionId",
        "SomeTopicArn"
      );

      expect(lambda.invoke).toHaveBeenCalledWith("StartIteration", {
        actionId: "SomeActionId"
      });

      expect(sns.notify).toHaveBeenCalledWith(
        {
          startTimestamp: 12345678,
          lastId: null,
          retry: 0
        },
        { arn: "SomeTopicArn" }
      );
    });
  });

  describe("addIterationError", () => {
    it("should add an iteration error", async () => {
      lambda.invoke = jest.fn().mockResolvedValue();

      await entityIterationService.addIterationError(
        "some message",
        "SomeActionId",
        12345678,
        "entity-1"
      );

      expect(lambda.invoke).toHaveBeenCalledWith("AddIterationError", {
        actionId: "SomeActionId",
        startTimestamp: 12345678,
        entityId: "entity-1",
        message: "some message"
      });
    });

    it("should handle an exception being thrown when adding an iteration error", async () => {
      lambda.invoke = jest
        .fn()
        .mockRejectedValue(new Error("deliberately thrown"));
      log.error = jest.fn();

      await entityIterationService.addIterationError(
        "some message",
        "SomeActionId",
        12345678,
        "entity-1"
      );

      expect(lambda.invoke).toHaveBeenCalled();
      expect(log.error).toHaveBeenCalled();
    });
  });

  describe("throttleIteration", () => {
    it("should throttle an iteration", async () => {
      await entityIterationService.throttleIteration([0, 0], 250);
    });
  });

  describe("invokeNextIteration", () => {
    it("should invoke the next iteration when the iteration end has not yet been reached", async () => {
      sns.notify = jest.fn().mockResolvedValue();

      await entityIterationService.invokeNextIteration(
        "image-1",
        12345678,
        "SomeActionId",
        "SomeTopicArn"
      );

      expect(sns.notify).toHaveBeenCalledWith(
        {
          startTimestamp: 12345678,
          lastId: "image-1",
          retry: 0
        },
        { arn: "SomeTopicArn" }
      );
    });

    it("should signal the end of the iteration when the end has been reached", async () => {
      lambda.invoke = jest.fn().mockResolvedValue();

      await entityIterationService.invokeNextIteration(
        null,
        12345678,
        "SomeActionId",
        "SomeTopicArn"
      );

      expect(lambda.invoke).toHaveBeenCalledWith("EndIteration", {
        actionId: "SomeActionId",
        startTimestamp: 12345678
      });
    });
  });
});
