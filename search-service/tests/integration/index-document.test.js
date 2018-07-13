import * as elasticsearch from "../utils/elasticsearch";
import * as searchIndexType from "../../src/types/search-index-type";
import * as entityType from "../../src/types/entity-type";
import * as statusType from "../../src/types/status-type";
import * as talentType from "../../src/types/talent-type";
import * as sns from "../utils/sns";
jest.setTimeout(60000);

const INDEX_DOCUMENT_TOPIC_NAME = "IndexDocument";

describe("index document", () => {
  beforeAll(async () => {
    await elasticsearch.createIndex(searchIndexType.TALENT);
    await elasticsearch.createIndex(searchIndexType.VENUE);
    await elasticsearch.createIndex(searchIndexType.EVENT);
    await elasticsearch.createIndex(searchIndexType.EVENT_SERIES);
    await elasticsearch.createIndex(searchIndexType.AUTOCOMPLETE);
  });

  afterAll(async () => {
    await elasticsearch.deleteIndex(searchIndexType.TALENT);
    await elasticsearch.deleteIndex(searchIndexType.VENUE);
    await elasticsearch.deleteIndex(searchIndexType.EVENT);
    await elasticsearch.deleteIndex(searchIndexType.EVENT_SERIES);
    await elasticsearch.deleteIndex(searchIndexType.AUTOCOMPLETE);
  });

  it("should index a talent", async () => {
    const talentToIndex = {
      status: statusType.ACTIVE,
      commonRole: "Director",
      entityType: entityType.TALENT,
      talentType: talentType.INDIVIDUAL,
      firstNames: "Carrie",
      id: "talent/carrie-cracknell",
      lastName: "Cracknell",
      version: 2
    };

    await sns.send(INDEX_DOCUMENT_TOPIC_NAME, {
      entityType: entityType.TALENT,
      entity: talentToIndex
    });

    const talent = await elasticsearch.getDocumentWithRetry(
      searchIndexType.TALENT,
      talentToIndex.id
    );

    expect(talent).toEqual(
      expect.objectContaining({
        _index: searchIndexType.TALENT,
        _type: "doc",
        _id: talentToIndex.id,
        _version: 2,
        _source: expect.objectContaining({
          entityType: entityType.TALENT,
          id: talentToIndex.id
        })
      })
    );

    const autocomplete = await elasticsearch.getDocumentWithRetry(
      searchIndexType.AUTOCOMPLETE,
      talentToIndex.id
    );

    expect(autocomplete).toEqual(
      expect.objectContaining({
        _index: searchIndexType.AUTOCOMPLETE,
        _type: "doc",
        _id: talentToIndex.id,
        _version: 2,
        _source: expect.objectContaining({
          entityType: entityType.TALENT,
          id: talentToIndex.id
        })
      })
    );
  });

  it("should index an event", async () => {
    const eventToIndex = {
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
          ratio: 0.44574780058651,
          dominantColor: "123456"
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
        copyright: "Pamela Raith / Hungry Caterpillar Show",
        dominantColor: "123456"
      }
    };

    await sns.send(INDEX_DOCUMENT_TOPIC_NAME, {
      entityType: entityType.EVENT,
      entity: eventToIndex
    });

    const event = await elasticsearch.getDocumentWithRetry(
      searchIndexType.EVENT,
      eventToIndex.id
    );

    expect(event).toEqual(
      expect.objectContaining({
        _index: searchIndexType.EVENT,
        _type: "doc",
        _id: eventToIndex.id,
        _version: 1,
        _source: expect.objectContaining({
          entityType: entityType.EVENT,
          id: eventToIndex.id,
          imageColor: "123456"
        })
      })
    );

    const autocomplete = await elasticsearch.getDocumentWithRetry(
      searchIndexType.AUTOCOMPLETE,
      eventToIndex.id
    );

    expect(autocomplete).toEqual(
      expect.objectContaining({
        _index: searchIndexType.AUTOCOMPLETE,
        _type: "doc",
        _id: eventToIndex.id,
        _version: 1,
        _source: expect.objectContaining({
          entityType: entityType.EVENT,
          id: eventToIndex.id
        })
      })
    );
  });

  it("should index a venue", async () => {
    const venueToIndex = {
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
    };

    await sns.send(INDEX_DOCUMENT_TOPIC_NAME, {
      entityType: entityType.VENUE,
      entity: venueToIndex
    });

    const venue = await elasticsearch.getDocumentWithRetry(
      searchIndexType.VENUE,
      venueToIndex.id
    );

    expect(venue).toEqual(
      expect.objectContaining({
        _index: searchIndexType.VENUE,
        _type: "doc",
        _id: venueToIndex.id,
        _version: 3,
        _source: expect.objectContaining({
          entityType: entityType.VENUE,
          id: venueToIndex.id
        })
      })
    );

    const autocomplete = await elasticsearch.getDocumentWithRetry(
      searchIndexType.AUTOCOMPLETE,
      venueToIndex.id
    );

    expect(autocomplete).toEqual(
      expect.objectContaining({
        _index: searchIndexType.AUTOCOMPLETE,
        _type: "doc",
        _id: venueToIndex.id,
        _version: 3,
        _source: expect.objectContaining({
          entityType: entityType.VENUE,
          id: venueToIndex.id
        })
      })
    );
  });

  it("should index an event series", async () => {
    const eventSeriesToIndex = {
      id: "event-series/bang-said-the-gun",
      status: "ACTIVE",
      name: "Bang Said The Gun",
      eventSeriesType: "OCCASIONAL",
      occurrence: "Third Thursday of each month",
      summary: "A poetry riot",
      mainImage: {
        id: "abcd1234abcd1234abcd1234abcd1234",
        copyright: "Foo",
        ratio: 1.2
      },
      description: "Poetry for people who dont like poetry.",
      descriptionCredit: "Some description credit",
      links: [{ type: "WIKIPEDIA", url: "https://en.wikipedia.org/foo" }],
      images: [
        {
          id: "abcd1234abcd1234abcd1234abcd1234",
          ratio: 1.2,
          copyright: "Foo"
        }
      ],
      weSay: "something",
      notes: "some notes",
      version: 1
    };

    await sns.send(INDEX_DOCUMENT_TOPIC_NAME, {
      entityType: entityType.EVENT_SERIES,
      entity: eventSeriesToIndex
    });

    const eventSeries = await elasticsearch.getDocumentWithRetry(
      searchIndexType.EVENT_SERIES,
      eventSeriesToIndex.id
    );

    expect(eventSeries).toEqual(
      expect.objectContaining({
        _index: searchIndexType.EVENT_SERIES,
        _type: "doc",
        _id: eventSeriesToIndex.id,
        _version: 1,
        _source: expect.objectContaining({
          entityType: entityType.EVENT_SERIES,
          id: eventSeriesToIndex.id
        })
      })
    );

    const autocomplete = await elasticsearch.getDocumentWithRetry(
      searchIndexType.AUTOCOMPLETE,
      eventSeriesToIndex.id
    );

    expect(autocomplete).toEqual(
      expect.objectContaining({
        _index: searchIndexType.AUTOCOMPLETE,
        _type: "doc",
        _id: eventSeriesToIndex.id,
        _version: 1,
        _source: expect.objectContaining({
          entityType: entityType.EVENT_SERIES,
          id: eventSeriesToIndex.id
        })
      })
    );
  });
});
