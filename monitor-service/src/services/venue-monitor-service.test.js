"use strict";

const diff = require("../venue-processing/diff");
const venueMonitorRepository = require("../persistence/venue-monitor-repository");
const venueMonitorService = require("./venue-monitor-service");

const sync = fn =>
  fn.then(res => () => res).catch(err => () => {
    throw err;
  });

describe("venue-monitor-service", () => {
  describe("updateVenueMonitor", () => {
    it("should update a venue monitor", async () => {
      venueMonitorRepository.update = jest.fn().mockResolvedValue();

      await venueMonitorService.updateVenueMonitor({
        venueId: "some-id",
        isIgnored: true,
        hasChanged: false
      });

      expect(venueMonitorRepository.update).toHaveBeenCalledWith({
        venueId: "some-id",
        isIgnored: true,
        hasChanged: false
      });
    });

    it("should throw an error when updating a venue monitor with invalid values", async () => {
      expect(
        await sync(
          venueMonitorService.updateVenueMonitor({
            venueId: "some-id",
            hasChanged: false
          })
        )
      ).toThrow();
    });
  });

  describe("getVenueMonitors", () => {
    it("should handle getting a non-existent venue monitor", async () => {
      venueMonitorRepository.tryGet = jest.fn().mockResolvedValue(null);

      const result = await venueMonitorService.getVenueMonitors(
        "almeida-theatre"
      );

      expect(result).toEqual([]);

      expect(venueMonitorRepository.tryGet).toHaveBeenCalledWith(
        "almeida-theatre"
      );
    });

    it("should get a venue monitor with no diff", async () => {
      venueMonitorRepository.tryGet = jest.fn().mockResolvedValue({
        id: "some-id",
        oldVenueText: "old venue text",
        venueText: "venue text"
      });

      diff.getDiff = jest.fn().mockResolvedValue(null);

      const result = await venueMonitorService.getVenueMonitors(
        "almeida-theatre"
      );

      expect(result).toEqual([{ id: "some-id" }]);

      expect(venueMonitorRepository.tryGet).toHaveBeenCalledWith(
        "almeida-theatre"
      );

      expect(diff.getDiff).toHaveBeenCalledWith("old venue text", "venue text");
    });

    it("should get a venue monitor with a diff", async () => {
      venueMonitorRepository.tryGet = jest.fn().mockResolvedValue({
        id: "some-id",
        oldVenueText: "old venue text",
        venueText: "venue text"
      });

      diff.getDiff = jest.fn().mockResolvedValue("change diff text");

      const result = await venueMonitorService.getVenueMonitors(
        "almeida-theatre"
      );

      expect(result).toEqual([
        {
          id: "some-id",
          changeDiff: "change diff text"
        }
      ]);

      expect(venueMonitorRepository.tryGet).toHaveBeenCalledWith(
        "almeida-theatre"
      );

      expect(diff.getDiff).toHaveBeenCalledWith("old venue text", "venue text");
    });
  });

  describe("save", () => {
    it("should handle saving no venue monitor", async () => {
      await venueMonitorService.save("almeida-theatre", null);
    });

    it("should handle saving venue monitor when it does not already exist", async () => {
      venueMonitorRepository.tryGet = jest.fn().mockResolvedValue(null);
      venueMonitorRepository.put = jest.fn().mockResolvedValue();

      await venueMonitorService.save("almeida-theatre", {
        venueText: "Foo" // TODO might be wrong
      });

      expect(venueMonitorRepository.tryGet).toHaveBeenCalledWith(
        "almeida-theatre"
      );

      expect(venueMonitorRepository.put).toHaveBeenCalledWith({
        venueId: "almeida-theatre",
        venueText: "Foo",
        isIgnored: false,
        hasChanged: false
      });
    });

    it("should handle saving venue monitor when it exists already with no old venue text and venue text is not updated", async () => {
      venueMonitorRepository.tryGet = jest.fn().mockResolvedValue({
        venueId: "almeida-theatre",
        venueText: "some text",
        isIgnored: false,
        hasChanged: false
      });

      venueMonitorRepository.put = jest.fn().mockResolvedValue();

      await venueMonitorService.save("almeida-theatre", {
        venueText: "some text"
      });

      expect(venueMonitorRepository.tryGet).toHaveBeenCalledWith(
        "almeida-theatre"
      );

      expect(venueMonitorRepository.put).toHaveBeenCalledWith({
        venueId: "almeida-theatre",
        venueText: "some text",
        isIgnored: false,
        hasChanged: false
      });
    });

    it("should handle saving venue monitor when it exists already with no old venue text and venue text is updated", async () => {
      venueMonitorRepository.tryGet = jest.fn().mockResolvedValue({
        venueId: "almeida-theatre",
        venueText: "some text",
        isIgnored: false,
        hasChanged: false
      });

      venueMonitorRepository.put = jest.fn().mockResolvedValue();

      await venueMonitorService.save("almeida-theatre", {
        venueText: "some new text"
      });

      expect(venueMonitorRepository.tryGet).toHaveBeenCalledWith(
        "almeida-theatre"
      );

      expect(venueMonitorRepository.put).toHaveBeenCalledWith({
        venueId: "almeida-theatre",
        oldVenueText: "some text",
        venueText: "some new text",
        isIgnored: false,
        hasChanged: true
      });
    });

    it("should handle saving venue monitor when it exists already with old venue text and updated venue text is same as old", async () => {
      venueMonitorRepository.tryGet = jest.fn().mockResolvedValue({
        venueId: "almeida-theatre",
        oldVenueText: "some old text",
        venueText: "some text",
        isIgnored: false,
        hasChanged: true
      });

      venueMonitorRepository.put = jest.fn().mockResolvedValue();

      await venueMonitorService.save("almeida-theatre", {
        venueText: "some old text"
      });

      expect(venueMonitorRepository.tryGet).toHaveBeenCalledWith(
        "almeida-theatre"
      );

      expect(venueMonitorRepository.put).toHaveBeenCalledWith({
        venueId: "almeida-theatre",
        venueText: "some old text",
        isIgnored: false,
        hasChanged: false
      });
    });

    it("should handle saving venue monitor when it exists already with old venue text and updated venue text is different", async () => {
      venueMonitorRepository.tryGet = jest.fn().mockResolvedValue({
        venueId: "almeida-theatre",
        oldVenueText: "some old text",
        venueText: "some text",
        isIgnored: false,
        hasChanged: true
      });

      venueMonitorRepository.put = jest.fn().mockResolvedValue();

      await venueMonitorService.save("almeida-theatre", {
        venueText: "some new text"
      });

      expect(venueMonitorRepository.tryGet).toHaveBeenCalledWith(
        "almeida-theatre"
      );

      expect(venueMonitorRepository.put).toHaveBeenCalledWith({
        venueId: "almeida-theatre",
        oldVenueText: "some old text",
        venueText: "some new text",
        isIgnored: false,
        hasChanged: true
      });
    });
  });
});
