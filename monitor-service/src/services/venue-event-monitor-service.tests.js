"use strict";

const diff = require("../venue-processing/diff");
const venueEventMonitorRepository = require("../persistence/venue-event-monitor-repository");
const venueEventMonitorService = require("./venue-event-monitor-service");

const sync = fn =>
  fn.then(res => () => res).catch(err => () => {
    throw err;
  });

describe("venue-event-monitor-service", () => {
  describe("updateVenueEventMonitor", () => {
    it("should update a venue event monitor", async () => {
      venueEventMonitorRepository.update = jest.fn().mockResolvedValue();

      await venueEventMonitorService.updateVenueEventMonitor({
        venueId: "some-id",
        externalEventId: "external-id",
        isIgnored: true,
        hasChanged: false
      });

      expect(venueEventMonitorRepository.update).toHaveBeenCalledWith({
        venueId: "some-id",
        externalEventId: "external-id",
        isIgnored: true,
        hasChanged: false
      });
    });

    it("should throw an error when updating a venue event monitor with invalid values", async () => {
      expect(
        await sync(
          venueEventMonitorService.updateVenueEventMonitor({
            venueId: "some-id",
            isIgnored: true,
            hasChanged: false
          })
        )
      ).toThrow();
    });
  });

  describe("getVenueEventMonitorsForVenue", () => {
    it("should get the venue event monitors for a venue", async () => {
      venueEventMonitorRepository.getAllForVenue = jest
        .fn()
        .mockResolvedValue([{ id: "some-id" }]);

      const result = await venueEventMonitorService.getVenueEventMonitorsForVenue(
        "almeida-theatre"
      );

      expect(result).toEqual([{ id: "some-id" }]);

      expect(venueEventMonitorRepository.getAllForVenue).toHaveBeenCalledWith(
        "almeida-theatre"
      );
    });
  });

  describe("getVenueEventMonitor", () => {
    it("should get a venue event monitor with no diff", async () => {
      venueEventMonitorRepository.get = jest.fn().mockResolvedValue({
        id: "some-id",
        oldEventText: "old event text",
        eventText: "event text"
      });

      diff.getDiff = jest.fn().mockResolvedValue(null);

      const result = await venueEventMonitorService.getVenueEventMonitor(
        "almeida-theatre",
        "external-id"
      );

      expect(result).toEqual({ id: "some-id" });

      expect(venueEventMonitorRepository.get).toHaveBeenCalledWith(
        "almeida-theatre",
        "external-id"
      );

      expect(diff.getDiff).toHaveBeenCalledWith("old event text", "event text");
    });

    it("should get a venue event monitor with a diff", async () => {
      venueEventMonitorRepository.get = jest.fn().mockResolvedValue({
        id: "some-id",
        oldEventText: "old event text",
        eventText: "event text"
      });

      diff.getDiff = jest.fn().mockResolvedValue("change diff text");

      const result = await venueEventMonitorService.getVenueEventMonitor(
        "almeida-theatre",
        "external-id"
      );

      expect(result).toEqual({
        id: "some-id",
        changeDiff: "change diff text"
      });

      expect(venueEventMonitorRepository.get).toHaveBeenCalledWith(
        "almeida-theatre",
        "external-id"
      );

      expect(diff.getDiff).toHaveBeenCalledWith("old event text", "event text");
    });
  });

  describe("save", () => {
    it("should handle saving no event monitors", async () => {
      await venueEventMonitorService.save("almeida-theatre", []);
    });

    it("should handle saving new combined events event monitors when none already exist", async () => {
      venueEventMonitorRepository.tryGet = jest.fn().mockResolvedValue(null);
      venueEventMonitorRepository.put = jest.fn().mockResolvedValue();

      await venueEventMonitorService.save("almeida-theatre", [
        {
          externalEventId: "almeida-theatre|/",
          title: "Combined Events",
          eventText: "Foo",
          combinedEvents: true
        }
      ]);

      expect(venueEventMonitorRepository.tryGet).toHaveBeenCalledWith(
        "almeida-theatre",
        "almeida-theatre|/"
      );

      expect(venueEventMonitorRepository.put).toHaveBeenCalledWith({
        venueId: "almeida-theatre",
        externalEventId: "almeida-theatre|/",
        isIgnored: false,
        title: "Combined Events",
        inArtfully: false,
        combinedEvents: true,
        hasChanged: true,
        eventText: "Foo"
      });
    });

    it("should handle saving new page-per-event event monitors when none already exist", async () => {
      venueEventMonitorRepository.tryGet = jest.fn().mockResolvedValue(null);
      venueEventMonitorRepository.put = jest.fn().mockResolvedValue();

      await venueEventMonitorService.save("almeida-theatre", [
        {
          externalEventId: "almeida-theatre|/",
          currentUrl: "http://almeida.com/foo",
          title: "Some Event",
          eventText: "description",
          inArtfully: true,
          artfullyEventId: "almeida-theatre/2017/bar",
          combinedEvents: false
        }
      ]);

      expect(venueEventMonitorRepository.tryGet).toHaveBeenCalledWith(
        "almeida-theatre",
        "almeida-theatre|/"
      );

      expect(venueEventMonitorRepository.put).toHaveBeenCalledWith({
        venueId: "almeida-theatre",
        externalEventId: "almeida-theatre|/",
        currentUrl: "http://almeida.com/foo",
        isIgnored: false,
        title: "Some Event",
        inArtfully: true,
        artfullyEventId: "almeida-theatre/2017/bar",
        hasChanged: false,
        eventText: "description",
        combinedEvents: false
      });
    });

    it("should handle saving a combined events event monitor that already exists where the event text changes", async () => {
      venueEventMonitorRepository.tryGet = jest.fn().mockResolvedValue({
        venueId: "almeida-theatre",
        externalEventId: "almeida-theatre|/",
        title: "http://test.com/old-title",
        isIgnored: false,
        inArtfully: false,
        hasChanged: true,
        eventText: "old description"
      });

      venueEventMonitorRepository.put = jest.fn().mockResolvedValue();

      await venueEventMonitorService.save("almeida-theatre", [
        {
          externalEventId: "almeida-theatre|/",
          title: "Combined Events",
          eventText: "new description",
          combinedEvents: true
        }
      ]);

      expect(venueEventMonitorRepository.tryGet).toHaveBeenCalledWith(
        "almeida-theatre",
        "almeida-theatre|/"
      );

      expect(venueEventMonitorRepository.put).toHaveBeenCalledWith({
        venueId: "almeida-theatre",
        externalEventId: "almeida-theatre|/",
        isIgnored: false,
        title: "Combined Events",
        inArtfully: false,
        combinedEvents: true,
        hasChanged: true,
        eventText: "new description",
        oldEventText: "old description"
      });
    });

    it("should handle saving a combined events event monitor that already exists where the old event text is restored", async () => {
      venueEventMonitorRepository.tryGet = jest.fn().mockResolvedValue({
        venueId: "almeida-theatre",
        externalEventId: "almeida-theatre|/",
        title: "http://test.com/old-title",
        isIgnored: false,
        inArtfully: false,
        hasChanged: true,
        oldEventText: "old description",
        eventText: "new description"
      });

      venueEventMonitorRepository.put = jest.fn().mockResolvedValue();

      await venueEventMonitorService.save("almeida-theatre", [
        {
          externalEventId: "almeida-theatre|/",
          title: "Combined Events",
          eventText: "old description",
          combinedEvents: true
        }
      ]);

      expect(venueEventMonitorRepository.tryGet).toHaveBeenCalledWith(
        "almeida-theatre",
        "almeida-theatre|/"
      );

      expect(venueEventMonitorRepository.put).toHaveBeenCalledWith({
        venueId: "almeida-theatre",
        externalEventId: "almeida-theatre|/",
        isIgnored: false,
        title: "Combined Events",
        inArtfully: false,
        combinedEvents: true,
        hasChanged: false,
        eventText: "old description"
      });
    });

    it("should handle saving a combined events event monitor that already exists where event text gets updated", async () => {
      venueEventMonitorRepository.tryGet = jest.fn().mockResolvedValue({
        venueId: "almeida-theatre",
        externalEventId: "almeida-theatre|/",
        title: "http://test.com/old-title",
        isIgnored: false,
        inArtfully: false,
        hasChanged: false,
        eventText: "description"
      });

      venueEventMonitorRepository.put = jest.fn().mockResolvedValue();

      await venueEventMonitorService.save("almeida-theatre", [
        {
          externalEventId: "almeida-theatre|/",
          title: "Combined Events",
          eventText: "new description",
          combinedEvents: true
        }
      ]);

      expect(venueEventMonitorRepository.tryGet).toHaveBeenCalledWith(
        "almeida-theatre",
        "almeida-theatre|/"
      );

      expect(venueEventMonitorRepository.put).toHaveBeenCalledWith({
        venueId: "almeida-theatre",
        externalEventId: "almeida-theatre|/",
        isIgnored: false,
        title: "Combined Events",
        inArtfully: false,
        combinedEvents: true,
        hasChanged: true,
        eventText: "new description",
        oldEventText: "description"
      });
    });

    it("should handle saving a combined events event monitor that already exists where event text is the same", async () => {
      venueEventMonitorRepository.tryGet = jest.fn().mockResolvedValue({
        venueId: "almeida-theatre",
        externalEventId: "almeida-theatre|/",
        title: "http://test.com/old-title",
        isIgnored: false,
        inArtfully: false,
        hasChanged: false,
        eventText: "description"
      });

      venueEventMonitorRepository.put = jest.fn().mockResolvedValue();

      await venueEventMonitorService.save("almeida-theatre", [
        {
          externalEventId: "almeida-theatre|/",
          title: "Combined Events",
          eventText: "description",
          combinedEvents: true
        }
      ]);

      expect(venueEventMonitorRepository.tryGet).toHaveBeenCalledWith(
        "almeida-theatre",
        "almeida-theatre|/"
      );

      expect(venueEventMonitorRepository.put).toHaveBeenCalledWith({
        venueId: "almeida-theatre",
        externalEventId: "almeida-theatre|/",
        isIgnored: false,
        title: "Combined Events",
        inArtfully: false,
        combinedEvents: true,
        hasChanged: false,
        eventText: "description"
      });
    });

    it("should handle saving a combined events event monitor that already exists and hasChanged is preserved", async () => {
      venueEventMonitorRepository.tryGet = jest.fn().mockResolvedValue({
        venueId: "almeida-theatre",
        externalEventId: "almeida-theatre|/",
        title: "http://test.com/old-title",
        isIgnored: false,
        inArtfully: false,
        combinedEvents: true,
        hasChanged: true,
        eventText: "description"
      });

      venueEventMonitorRepository.put = jest.fn().mockResolvedValue();

      await venueEventMonitorService.save("almeida-theatre", [
        {
          externalEventId: "almeida-theatre|/",
          title: "Combined Events",
          eventText: "description",
          combinedEvents: true
        }
      ]);

      expect(venueEventMonitorRepository.tryGet).toHaveBeenCalledWith(
        "almeida-theatre",
        "almeida-theatre|/"
      );

      expect(venueEventMonitorRepository.put).toHaveBeenCalledWith({
        venueId: "almeida-theatre",
        externalEventId: "almeida-theatre|/",
        isIgnored: false,
        title: "Combined Events",
        inArtfully: false,
        combinedEvents: true,
        hasChanged: true,
        eventText: "description"
      });
    });
  });
});
