"use strict";

const search = require("../external-services/search");
const subject = require("./venue-strategy-runner");

describe("venue-strategy-runner", () => {
  describe("getVenueData", () => {
    it("should process a venue", async () => {
      const venueStrategy = {
        venueOpenings: () => Promise.resolve(["description", "foo"])
      };

      const result = await subject.getVenueData(venueStrategy);
      expect(result).toEqual({ venueText: "description\n\nfoo" });
    });
  });

  describe("discoverEvents", () => {
    it("should process a venue with all events on one page", async () => {
      const venueStrategy = {
        pageParser: () => Promise.resolve({ data: ["description", "foo"] })
      };

      const result = await subject.discoverEvents(
        "almeida-theatre",
        venueStrategy
      );

      expect(result).toEqual([
        {
          title: "Combined Events",
          externalEventId: "almeida-theatre|/",
          eventText: "description\n\nfoo",
          combinedEvents: true
        }
      ]);
    });

    it("should process a venue with all events on one page and empty data", async () => {
      const venueStrategy = {
        pageParser: () => Promise.resolve({ data: [] })
      };

      const result = await subject.discoverEvents(
        "almeida-theatre",
        venueStrategy
      );

      expect(result).toEqual([
        {
          title: "Combined Events",
          externalEventId: "almeida-theatre|/",
          eventText: "[Empty]",
          combinedEvents: true
        }
      ]);
    });

    it("should process a venue with a separate page for each event", async () => {
      const venueStrategy = {
        pageFinder: () =>
          Promise.resolve(["http://test.com/a", "http://test.com/b"]),
        pageParser: () =>
          Promise.resolve({
            title: "<p>Some<br/>Title</p>",
            data: "<p>description</p>"
          })
      };

      search.findEvents = jest.fn().mockResolvedValue([null, "artfully/id"]);

      const result = await subject.discoverEvents(
        "almeida-theatre",
        venueStrategy
      );

      expect(result).toEqual([
        {
          title: "Some Title",
          externalEventId: "almeida-theatre|/a",
          currentUrl: "http://test.com/a",
          eventText: "description",
          inArtfully: false,
          combinedEvents: false
        },
        {
          title: "Some Title",
          externalEventId: "almeida-theatre|/b",
          currentUrl: "http://test.com/b",
          eventText: "description",
          artfullyEventId: "artfully/id",
          inArtfully: true,
          combinedEvents: false
        }
      ]);

      expect(search.findEvents).toHaveBeenCalledWith("almeida-theatre", [
        "almeida-theatre|/a",
        "almeida-theatre|/b"
      ]);
    });
  });
});
