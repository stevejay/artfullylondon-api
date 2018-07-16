import * as mapper from "./index";
import * as entityType from "../../types/entity-type";
import * as statusType from "../../types/status-type";
import * as talentType from "../../types/talent-type";
import * as eventSeriesType from "../../types/event-series-type";
import * as venueType from "../../types/venue-type";
import * as eventType from "../../types/event-type";

describe("mapTalentForEntityIndex", () => {
  it("should map a talent with an image", () => {
    const talent = {
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

    const result = mapper.mapTalentForEntityIndex(talent);

    expect(result).toEqual({
      entityType: entityType.TALENT,
      id: "talent/talent-1",
      status: statusType.ACTIVE,
      name: "Cherry Pie",
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
      id: "talent/talent-1",
      status: statusType.ACTIVE,
      firstNames: "Cherry",
      lastName: "Pie",
      talentType: talentType.INDIVIDUAL,
      commonRole: "Actor",
      version: 1
    };

    const result = mapper.mapTalentForEntityIndex(talent);

    expect(result).toEqual({
      entityType: entityType.TALENT,
      id: "talent/talent-1",
      status: statusType.ACTIVE,
      name: "Cherry Pie",
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

describe("mapEventSeriesForEntityIndex", () => {
  it("should map an event series", () => {
    const eventSeries = {
      id: "event-series-1",
      status: statusType.ACTIVE,
      name: "Bang Said The Gun",
      version: 1,
      eventSeriesType: eventSeriesType.OCCASIONAL,
      occurrence: "Monthly",
      summary: "Some summary"
    };

    const result = mapper.mapEventSeriesForEntityIndex(eventSeries);

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

describe("mapVenueForEntityIndex", () => {
  it("should map a venue", () => {
    const venue = {
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

    const result = mapper.mapVenueForEntityIndex(venue);

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

describe("mapEventForEntityIndex", () => {
  it("should map an event", () => {
    const event = {
      id: "event/pleasance-theatre/2017/the-very-hungry-caterpillar",
      status: "ACTIVE",
      name: "The Very Hungry Caterpillar",
      eventType: "PERFORMANCE",
      occurrenceType: "ONE_TIME",
      costType: "PAID",
      summary: "A production.",
      dateFrom: "2017-03-19",
      dateTo: "2017-03-19",
      rating: 3,
      bookingType: "REQUIRED",
      useVenueOpeningTimes: false,
      costFrom: 10,
      costTo: 12,
      bookingOpens: "2017-03-01",
      duration: "02:00",
      description: "<p>The Very Hungry Caterpillar</p>",
      descriptionCredit: "Pleasance Theatre",
      additionalPerformances: [
        {
          date: "2017-03-19",
          at: "14:30"
        }
      ],
      audienceTags: [
        {
          id: "audience/children",
          label: "children"
        }
      ],
      mediumTags: [
        {
          id: "medium/puppetry",
          label: "puppetry"
        }
      ],
      links: [
        {
          type: "HOMEPAGE",
          url: "https://www.pleasance.co.uk/event/very-hungry-caterpillar"
        }
      ],
      images: [
        {
          copyright: "Pamela Raith / Hungry Caterpillar Show",
          id: "2aae2f6ce93b4a7f80b35060a9003138",
          ratio: 0.44574780058651
        }
      ],
      version: 1,
      venue: {
        id: "venue/pleasance-theatre",
        status: "ACTIVE",
        name: "Pleasance Theatre",
        venueType: "THEATRE",
        address: "Carpenters Mews\\nNorth Rd\\nLondon",
        postcode: "N7 9EF",
        latitude: 51.548796973338,
        longitude: -0.12151211500168,
        description: "<p>The Pleasance Theatre is a fringe theatre.</p>",
        links: [
          {
            type: "FACEBOOK",
            url: "https://www.facebook.com/ThePleasance/"
          },
          {
            type: "TWITTER",
            url: "https://twitter.com/ThePleasance"
          },
          {
            type: "WIKIPEDIA",
            url: "https://en.wikipedia.org/wiki/Pleasance_Islington"
          },
          {
            type: "ACCESS",
            url: "https://www.pleasance.co.uk/accessibility"
          },
          {
            type: "HOMEPAGE",
            url: "https://www.pleasance.co.uk/via/search/london"
          }
        ],
        wheelchairAccessType: "UNKNOWN",
        disabledBathroomType: "UNKNOWN",
        hearingFacilitiesType: "UNKNOWN",
        telephone: "020 7609 1800",
        version: 3
      },
      talents: [
        {
          roles: ["Author / Illustrator"],
          talent: {
            id: "talent/eric-carle-author-illustrator",
            status: "ACTIVE",
            firstNames: "Eric",
            lastName: "Carle",
            talentType: "INDIVIDUAL",
            commonRole: "Author / Illustrator",
            version: 1
          }
        },
        {
          roles: ["Creator"],
          talent: {
            id: "talent/jonathan-rockefeller-director",
            status: "ACTIVE",
            firstNames: "Jonathan",
            lastName: "Rockefeller",
            talentType: "INDIVIDUAL",
            commonRole: "Director",
            version: 1
          }
        }
      ],
      mainImage: {
        id: "2aae2f6ce93b4a7f80b35060a9003138",
        ratio: 0.44574780058651,
        copyright: "Pamela Raith / Hungry Caterpillar Show"
      }
    };

    const result = mapper.mapEventForEntityIndex(event);

    expect(result).toEqual({
      area: "NORTH",
      artsType: "PERFORMING",
      bookingType: "REQUIRED",
      costFrom: 10,
      costType: "PAID",
      dateFrom: "2017-03-19",
      dateTo: "2017-03-19",
      dates: [],
      entityType: "EVENT",
      eventType: "PERFORMANCE",
      externalEventId: "venue/pleasance-theatre|/event/very-hungry-caterpillar",
      id: "event/pleasance-theatre/2017/the-very-hungry-caterpillar",
      image: "2aae2f6ce93b4a7f80b35060a9003138",
      imageCopyright: "Pamela Raith / Hungry Caterpillar Show",
      imageRatio: 0.44574780058651,
      latitude: 51.548796973338,
      locationOptimized: {
        lat: 51.548796973338,
        lon: -0.12151211500168
      },
      longitude: -0.12151211500168,
      name: "The Very Hungry Caterpillar",
      name_sort: "very hungry caterpillar",
      occurrenceType: "ONE_TIME",
      postcode: "N7 9EF",
      rating: 3,
      status: "ACTIVE",
      summary: "A production.",
      tags: ["audience/children", "medium/puppetry"],
      talents: [
        "talent/eric-carle-author-illustrator",
        "talent/jonathan-rockefeller-director"
      ],
      venueId: "venue/pleasance-theatre",
      venueName: "Pleasance Theatre",
      venueName_sort: "pleasance theatre",
      version: 1
    });
  });
});

describe("mapEventForAutocompleteIndex", () => {
  it("should map an event", () => {
    const event = {
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
