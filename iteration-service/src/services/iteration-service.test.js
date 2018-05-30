"use strict";

const iterationService = require("./iteration-service");
const iterationErrorRepository = require("../persistence/iteration-error-repository");
const iterationLockRepository = require("../persistence/iteration-lock-repository");
const iterationRepository = require("../persistence/iteration-repository");

describe("iteration-service", () => {
  describe("addIterationError", () => {
    it("should add an iteration error", async () => {
      iterationErrorRepository.saveError = jest.fn().mockResolvedValue();

      await iterationService.addIterationError(
        "some-action-id",
        12345678,
        "some-entity-id",
        "Some message"
      );

      expect(iterationErrorRepository.saveError).toHaveBeenCalledWith({
        actionIdStartTimestamp: "some-action-id_12345678",
        entityId: "some-entity-id",
        message: "Some message"
      });
    });
  });

  describe("endIteration", () => {
    it("should end an iteration", async () => {
      iterationLockRepository.deleteLock = jest.fn().mockResolvedValue();

      iterationRepository.setIterationEndTimestamp = jest
        .fn()
        .mockResolvedValue();

      await iterationService.endIteration("some-action-id", 12345678);

      expect(iterationLockRepository.deleteLock).toHaveBeenCalledWith(
        "some-action-id"
      );

      expect(iterationRepository.setIterationEndTimestamp).toHaveBeenCalledWith(
        "some-action-id",
        12345678
      );
    });
  });

  describe("startIteration", () => {
    it("should start an iteration", async () => {
      iterationLockRepository.addLock = jest.fn().mockResolvedValue();
      iterationRepository.addIteration = jest.fn().mockResolvedValue();

      const response = await iterationService.startIteration("some-action-id");

      expect(response.actionId).toEqual("some-action-id");
      expect(response.startTimestamp).toBeGreaterThan(0);

      expect(iterationLockRepository.addLock).toHaveBeenCalledWith(
        expect.objectContaining({
          actionId: "some-action-id"
        })
      );

      expect(iterationRepository.addIteration).toHaveBeenCalledWith(
        expect.objectContaining({
          actionId: "some-action-id"
        })
      );
    });
  });

  describe("getLatestIterationErrors", () => {
    it("should get the latest iteration errors when there are errors", async () => {
      iterationRepository.getMostRecentIteration = jest
        .fn()
        .mockResolvedValue({ Items: [{ startTimestamp: 12345678 }] });

      iterationErrorRepository.getErrorsForIteration = jest
        .fn()
        .mockResolvedValue([{ id: "some-id" }]);

      const response = await iterationService.getLatestIterationErrors(
        "some-action-id"
      );

      expect(response).toEqual([{ id: "some-id" }]);

      expect(iterationRepository.getMostRecentIteration).toHaveBeenCalledWith(
        "some-action-id"
      );

      expect(
        iterationErrorRepository.getErrorsForIteration
      ).toHaveBeenCalledWith("some-action-id_12345678");
    });

    it("should get the latest iteration errors when there are no errors", async () => {
      iterationRepository.getMostRecentIteration = jest
        .fn()
        .mockResolvedValue({ Items: [{ startTimestamp: 12345678 }] });

      iterationErrorRepository.getErrorsForIteration = jest
        .fn()
        .mockResolvedValue([]);

      const response = await iterationService.getLatestIterationErrors(
        "some-action-id"
      );

      expect(response).toEqual([]);

      expect(iterationRepository.getMostRecentIteration).toHaveBeenCalledWith(
        "some-action-id"
      );

      expect(
        iterationErrorRepository.getErrorsForIteration
      ).toHaveBeenCalledWith("some-action-id_12345678");
    });

    it("should handle not finding a most recent iteration", async () => {
      iterationRepository.getMostRecentIteration = jest
        .fn()
        .mockResolvedValue({ Items: [] });

      const response = await iterationService.getLatestIterationErrors(
        "some-action-id"
      );

      expect(response).toEqual([]);

      expect(iterationRepository.getMostRecentIteration).toHaveBeenCalledWith(
        "some-action-id"
      );
    });
  });
});
