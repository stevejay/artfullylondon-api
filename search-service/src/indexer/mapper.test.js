import * as mapper from "./mapper";
import * as entityType from "../types/entity-type";

describe("mapTalentForTalentIndex", () => {
  it("should map a talent with an image", () => {
    const talent = {
      entityType: entityType.TALENT,
      id: "talent-1",
      status: "Active",
      firstNames: "Cherry",
      lastName: "Pie",
      talentType: "Individual",
      commonRole: "Actor",
      version: 1,
      images: [
        {
          id: "image-1",
          copyright: "Copyright 1",
          ratio: 10,
          dominantColor: "111"
        },
        {
          id: "image-2",
          copyright: "Copyright 2",
          ratio: 20,
          dominantColor: "222"
        }
      ]
    };

    const result = mapper.mapTalentForTalentIndex(talent);

    expect(result).toEqual({
      entityType: entityType.TALENT,
      id: "talent-1",
      status: "Active",
      firstNames: "Cherry",
      lastName: "Pie",
      lastName_sort: "pie",
      talentType: "Individual",
      commonRole: "Actor",
      version: 1,
      image: "image-1",
      imageCopyright: "Copyright 1",
      imageRatio: 10,
      imageColor: "111"
    });
  });

  it("should map a talent with no image", () => {
    const talent = {
      entityType: entityType.TALENT,
      id: "talent-1",
      status: "Active",
      firstNames: "Cherry",
      lastName: "Pie",
      talentType: "Individual",
      commonRole: "Actor",
      version: 1
    };

    const result = mapper.mapTalentForTalentIndex(talent);

    expect(result).toEqual({
      entityType: entityType.TALENT,
      id: "talent-1",
      status: "Active",
      firstNames: "Cherry",
      lastName: "Pie",
      lastName_sort: "pie",
      talentType: "Individual",
      commonRole: "Actor",
      version: 1
    });
  });
});

describe("mapTalentForAutocompleteIndex", () => {
  it("should map an individual", () => {
    const talent = {
      entityType: entityType.TALENT,
      id: "talent-1",
      status: "Active",
      firstNames: "Cherry",
      lastName: "Pie",
      talentType: "Individual",
      commonRole: "Actor",
      version: 1
    };

    const result = mapper.mapTalentForAutocompleteIndex(talent);

    expect(result).toEqual({
      entityType: entityType.TALENT,
      id: "talent-1",
      status: "Active",
      talentType: "Individual",
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
      status: "Active",
      name: "Bang Said The Gun",
      version: 1,
      eventSeriesType: "Occasional",
      occurrence: "Monthly",
      summary: "Some summary"
    };

    const result = mapper.mapEventSeriesForEventSeriesIndex(eventSeries);

    expect(result).toEqual({
      entityType: entityType.EVENT_SERIES,
      id: "event-series-1",
      status: "Active",
      name: "Bang Said The Gun",
      name_sort: "bang said the gun",
      version: 1,
      eventSeriesType: "Occasional",
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
      status: "Active",
      name: "Bang Said The Gun",
      version: 1,
      eventSeriesType: "Occasional",
      occurrence: "Monthly",
      summary: "Some summary"
    };

    const result = mapper.mapEventSeriesForAutocompleteIndex(eventSeries);

    expect(result).toEqual({
      entityType: entityType.EVENT_SERIES,
      id: "event-series-1",
      status: "Active",
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
      id: "venue-1",
      status: "Active",
      name: "Almeida Theatre",
      version: 1,
      venueType: "Theatre",
      address: "56 Some Street",
      postcode: "N5 2AA",
      latitude: 11,
      longitude: 22
    };

    const result = mapper.mapVenueForVenueIndex(venue);

    expect(result).toEqual({
      entityType: entityType.VENUE,
      id: "venue-1",
      status: "Active",
      name: "Almeida Theatre",
      name_sort: "almeida theatre",
      version: 1,
      venueType: "Theatre",
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
      id: "venue-1",
      status: "Active",
      name: "Almeida Theatre",
      version: 1,
      venueType: "Theatre",
      address: "56 Some Street",
      postcode: "N5 2AA",
      latitude: 11,
      longitude: 22
    };

    const result = mapper.mapVenueForAutocompleteIndex(venue);

    expect(result).toEqual({
      entityType: entityType.VENUE,
      id: "venue-1",
      status: "Active",
      output: "Almeida Theatre",
      nameSuggest: ["almeida theatre"],
      version: 1,
      venueType: "Theatre",
      address: "56 Some Street",
      postcode: "N5 2AA"
    });
  });
});

describe("mapEventForAutocompleteIndex", () => {
  it("should map an event", () => {
    const event = {
      entityType: entityType.EVENT,
      id: "event-1",
      status: "Active",
      name: "The Merchant of Venice",
      version: 1,
      eventType: "Performance",
      venue: {
        name: "Almeida Theatre"
      }
    };

    const result = mapper.mapEventForAutocompleteIndex(event);

    expect(result).toEqual({
      entityType: entityType.EVENT,
      id: "event-1",
      status: "Active",
      output: "The Merchant of Venice (Almeida Theatre)",
      nameSuggest: [
        "the merchant of venice",
        "almeida theatre",
        "merchant of venice"
      ],
      version: 1,
      eventType: "Performance"
    });
  });
});
