"use strict";

const strategyRunner = require("../venue-processing/venue-strategy-runner");
const strategyFactory = require("../venue-processing/venue-strategy-factory");
const venueIterationService = require("./venue-iteration-service");
const venueService = require("./venue-service");
const venueEventMonitorService = require("./venue-event-monitor-service");
const venueMonitorService = require("./venue-monitor-service");

describe("venue-service", () => {
  describe("processNextVenue", () => {
    it("should handle there being no next venue", async () => {
      venueIterationService.getNextVenue = jest.fn().mockResolvedValue(null);
      venueIterationService.invokeNextIteration = jest.fn().mockResolvedValue();

      await venueService.processNextVenue(
        "almeida-theatre",
        process.hrtime(),
        2147483647
      );

      expect(venueIterationService.getNextVenue).toHaveBeenCalledWith(
        "almeida-theatre"
      );

      expect(
        venueIterationService.invokeNextIteration.mock.calls[0][0]
      ).toEqual(null);
    });

    it("should handle there being a next venue but it does not have a strategy", async () => {
      venueIterationService.getNextVenue = jest
        .fn()
        .mockResolvedValue("tate-modern");
      strategyFactory.create = jest.fn().mockReturnValue(null);
      venueIterationService.throttleIteration = jest.fn().mockResolvedValue();
      venueIterationService.invokeNextIteration = jest.fn().mockResolvedValue();

      await venueService.processNextVenue(
        "almeida-theatre",
        process.hrtime(),
        2147483647
      );

      expect(venueIterationService.getNextVenue).toHaveBeenCalledWith(
        "almeida-theatre"
      );

      expect(strategyFactory.create).toHaveBeenCalledWith("tate-modern");
      expect(venueIterationService.throttleIteration).toHaveBeenCalled();

      expect(
        venueIterationService.invokeNextIteration.mock.calls[0][0]
      ).toEqual("tate-modern");
    });

    it("should handle there being a next venue with a strategy", async () => {
      venueIterationService.getNextVenue = jest
        .fn()
        .mockResolvedValue("tate-modern");
      const mockStrategy = {};
      strategyFactory.create = jest.fn().mockReturnValue(mockStrategy);
      strategyRunner.discoverEvents = jest
        .fn()
        .mockResolvedValue([{ id: "some-event-id" }]);
      venueEventMonitorService.save = jest.fn().mockResolvedValue();
      strategyRunner.getVenueData = jest
        .fn()
        .mockResolvedValue({ text: "Venue data" });
      venueMonitorService.save = jest.fn().mockResolvedValue();
      venueIterationService.throttleIteration = jest.fn().mockResolvedValue();
      venueIterationService.invokeNextIteration = jest.fn().mockResolvedValue();

      await venueService.processNextVenue(
        "almeida-theatre",
        process.hrtime(),
        2147483647
      );

      expect(venueIterationService.getNextVenue).toHaveBeenCalledWith(
        "almeida-theatre"
      );

      expect(strategyFactory.create).toHaveBeenCalledWith("tate-modern");
      expect(strategyRunner.discoverEvents).toHaveBeenCalledWith(
        "tate-modern",
        mockStrategy
      );
      expect(venueEventMonitorService.save).toHaveBeenCalledWith(
        "tate-modern",
        [{ id: "some-event-id" }]
      );

      expect(strategyRunner.getVenueData).toHaveBeenCalledWith(mockStrategy);
      expect(venueMonitorService.save).toHaveBeenCalledWith("tate-modern", {
        text: "Venue data"
      });

      expect(venueIterationService.throttleIteration).toHaveBeenCalled();

      expect(
        venueIterationService.invokeNextIteration.mock.calls[0][0]
      ).toEqual("tate-modern");
    });
  });
});
