import * as mapper from "./index";
import * as entityType from "../../types/entity-type";
import * as statusType from "../../types/status-type";
import * as talentType from "../../types/talent-type";
import * as eventSeriesType from "../../types/event-series-type";
import * as venueType from "../../types/venue-type";
import * as eventType from "../../types/event-type";

describe("mapTalentForTalentIndex", () => {
  it("should map a talent with an image", () => {
    const talent = {
      entityType: entityType.TALENT,
      id: "talent/talent-1",
      status: statusType.ACTIVE,
      firstNames: "Cherry",
      lastName: "Pie",
      talentType: talentType.INDIVIDUAL,
      commonRole: "Actor",
      version: 1,
      images: [
        {
          id: "image/image-1",
          copyright: "Copyright 1",
          ratio: 10,
          dominantColor: "111"
        },
        {
          id: "image/image-2",
          copyright: "Copyright 2",
          ratio: 20,
          dominantColor: "222"
        }
      ]
    };

    const result = mapper.mapTalentForTalentIndex(talent);

    expect(result).toEqual({
      entityType: entityType.TALENT,
      id: "talent/talent-1",
      status: statusType.ACTIVE,
      firstNames: "Cherry",
      lastName: "Pie",
      lastName_sort: "pie",
      talentType: talentType.INDIVIDUAL,
      commonRole: "Actor",
      version: 1,
      image: "image/image-1",
      imageCopyright: "Copyright 1",
      imageRatio: 10,
      imageColor: "111"
    });
  });

  it("should map a talent with no image", () => {
    const talent = {
      entityType: entityType.TALENT,
      id: "talent/talent-1",
      status: statusType.ACTIVE,
      firstNames: "Cherry",
      lastName: "Pie",
      talentType: talentType.INDIVIDUAL,
      commonRole: "Actor",
      version: 1
    };

    const result = mapper.mapTalentForTalentIndex(talent);

    expect(result).toEqual({
      entityType: entityType.TALENT,
      id: "talent/talent-1",
      status: statusType.ACTIVE,
      firstNames: "Cherry",
      lastName: "Pie",
      lastName_sort: "pie",
      talentType: talentType.INDIVIDUAL,
      commonRole: "Actor",
      version: 1
    });
  });
});

describe("mapTalentForAutocompleteIndex", () => {
  it("should map an individual", () => {
    const talent = {
      entityType: entityType.TALENT,
      id: "talent/talent-1",
      status: statusType.ACTIVE,
      firstNames: "Cherry",
      lastName: "Pie",
      talentType: talentType.INDIVIDUAL,
      commonRole: "Actor",
      version: 1
    };

    const result = mapper.mapTalentForAutocompleteIndex(talent);

    expect(result).toEqual({
      entityType: entityType.TALENT,
      id: "talent/talent-1",
      status: statusType.ACTIVE,
      talentType: talentType.INDIVIDUAL,
      commonRole: "Actor",
      version: 1,
      output: "Cherry Pie",
      nameSuggest: ["cherry pie", "pie"]
    });
  });
});

describe("mapEventSeriesForEventSeriesIndex", () => {
  it("should map an event series", () => {
    const eventSeries = {
      entityType: entityType.EVENT_SERIES,
      id: "event-series-1",
      status: statusType.ACTIVE,
      name: "Bang Said The Gun",
      version: 1,
      eventSeriesType: eventSeriesType.OCCASIONAL,
      occurrence: "Monthly",
      summary: "Some summary"
    };

    const result = mapper.mapEventSeriesForEventSeriesIndex(eventSeries);

    expect(result).toEqual({
      entityType: entityType.EVENT_SERIES,
      id: "event-series-1",
      status: statusType.ACTIVE,
      name: "Bang Said The Gun",
      name_sort: "bang said the gun",
      version: 1,
      eventSeriesType: eventSeriesType.OCCASIONAL,
      occurrence: "Monthly",
      summary: "Some summary"
    });
  });
});

describe("mapEventSeriesForAutocompleteIndex", () => {
  it("should map an event series", () => {
    const eventSeries = {
      entityType: entityType.EVENT_SERIES,
      id: "event-series-1",
      status: statusType.ACTIVE,
      name: "Bang Said The Gun",
      version: 1,
      eventSeriesType: eventSeriesType.OCCASIONAL,
      occurrence: "Monthly",
      summary: "Some summary"
    };

    const result = mapper.mapEventSeriesForAutocompleteIndex(eventSeries);

    expect(result).toEqual({
      entityType: entityType.EVENT_SERIES,
      id: "event-series-1",
      status: statusType.ACTIVE,
      version: 1,
      output: "Bang Said The Gun (Event Series)",
      nameSuggest: ["bang said the gun"]
    });
  });
});

describe("mapVenueForVenueIndex", () => {
  it("should map a venue", () => {
    const venue = {
      entityType: entityType.VENUE,
      id: "venue/venue-1",
      status: statusType.ACTIVE,
      name: "Almeida Theatre",
      version: 1,
      venueType: venueType.THEATRE,
      address: "56 Some Street",
      postcode: "N5 2AA",
      latitude: 11,
      longitude: 22
    };

    const result = mapper.mapVenueForVenueIndex(venue);

    expect(result).toEqual({
      entityType: entityType.VENUE,
      id: "venue/venue-1",
      status: statusType.ACTIVE,
      name: "Almeida Theatre",
      name_sort: "almeida theatre",
      version: 1,
      venueType: venueType.THEATRE,
      address: "56 Some Street",
      postcode: "N5 2AA",
      latitude: 11,
      longitude: 22,
      locationOptimized: { lat: 11, lon: 22 }
    });
  });
});

describe("mapVenueForAutocompleteIndex", () => {
  it("should map a venue", () => {
    const venue = {
      entityType: entityType.VENUE,
      id: "venue/venue-1",
      status: statusType.ACTIVE,
      name: "Almeida Theatre",
      version: 1,
      venueType: venueType.THEATRE,
      address: "56 Some Street",
      postcode: "N5 2AA",
      latitude: 11,
      longitude: 22
    };

    const result = mapper.mapVenueForAutocompleteIndex(venue);

    expect(result).toEqual({
      entityType: entityType.VENUE,
      id: "venue/venue-1",
      status: statusType.ACTIVE,
      output: "Almeida Theatre",
      nameSuggest: ["almeida theatre"],
      version: 1,
      venueType: venueType.THEATRE,
      address: "56 Some Street",
      postcode: "N5 2AA"
    });
  });
});

describe("mapEventForAutocompleteIndex", () => {
  it("should map an event", () => {
    const event = {
      entityType: entityType.EVENT,
      id: "event/event-1",
      status: statusType.ACTIVE,
      name: "The Merchant of Venice",
      version: 1,
      eventType: eventType.PERFORMANCE,
      venue: {
        name: "Almeida Theatre"
      }
    };

    const result = mapper.mapEventForAutocompleteIndex(event);

    expect(result).toEqual({
      entityType: entityType.EVENT,
      id: "event/event-1",
      status: statusType.ACTIVE,
      output: "The Merchant of Venice (Almeida Theatre)",
      nameSuggest: [
        "the merchant of venice",
        "almeida theatre",
        "merchant of venice"
      ],
      version: 1,
      eventType: eventType.PERFORMANCE
    });
  });
});
