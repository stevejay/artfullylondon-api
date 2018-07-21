import * as normaliser from "./normaliser";
import * as linkType from "../types/link-type";

describe("event normaliser", () => {
  it("should apply event normalisers to fully populated params", () => {
    const params = {
      name: "   Taming of the Shrew  ",
      summary: "   A contemporary update of this Shakespeare classic  ",
      description:
        "  <p><script>alert('hello world')</script>A contemporary update of this Shakespeare classic by the acclaimed director Sam Mendes.</p>  ",
      descriptionCredit: "   Some credit   ",
      links: [
        { type: linkType.WIKIPEDIA, url: "   https://en.wikipedia.org/foo   " }
      ],
      duration: "  01:30 ",
      venueGuidance: "  Exhibition is located   ",
      timesRanges: [
        {
          id: "full-run",
          dateFrom: null,
          dateTo: "2017-01-20",
          label: " Full Run  "
        }
      ],
      openingTimes: [
        { day: 1, from: "09:00", to: "18:00", timesRangeId: "full-run" }
      ],
      performances: [{ day: 1, at: "18:00" }],
      additionalOpeningTimes: [
        { date: "2016-02-11", from: "09:00", to: "18:00" }
      ],
      additionalPerformances: [{ date: "2016-02-11", at: "15:00" }],
      specialOpeningTimes: [
        {
          date: "2016-02-11",
          from: "09:00",
          to: "18:00",
          audienceTags: [{ id: "audience/adult", label: "Adult" }]
        }
      ],
      specialPerformances: [
        {
          date: "2016-02-11",
          at: "15:00",
          audienceTags: [{ id: "audience/adult", label: "Adult" }]
        }
      ],
      openingTimesClosures: ["2016-12-25"],
      performancesClosures: ["2016-12-26"],
      talents: [
        {
          id: "john-doe",
          roles: ["  Director    Actor   "],
          characters: ["  Polonius   "]
        },
        {
          id: "jane-doe",
          roles: [],
          characters: []
        }
      ],
      audienceTags: [{ id: "audience/families", label: "families" }],
      mediumTags: [{ id: "medium/sculpture", label: "sculpture" }],
      styleTags: [{ id: "style/contemporary", label: "contemporary" }],
      geoTags: [{ id: "geo/europe", label: "europe" }],
      images: [
        {
          id: "abcd1234abcd1234abcd1234abcd1234",
          ratio: 1.2,
          copyright: " Foo  ",
          dominantColor: "   af0900 "
        }
      ],
      reviews: [{ source: "    The  Guardian   ", rating: 4 }],
      weSay: "   something   ",
      soldOutPerformances: [{ date: "2017-01-20", at: "09:00" }],
      version: 1
    };

    const result = normaliser.normaliseCreateOrUpdateEventRequest(params);

    expect(result).toEqual({
      name: "Taming of the Shrew",
      summary: "A contemporary update of this Shakespeare classic",
      description:
        "<p>A contemporary update of this Shakespeare classic by the acclaimed director Sam Mendes.</p>",
      descriptionCredit: "Some credit",
      links: [
        { type: linkType.WIKIPEDIA, url: "https://en.wikipedia.org/foo" }
      ],
      duration: "01:30",
      venueGuidance: "Exhibition is located",
      timesRanges: [
        {
          id: "full-run",
          dateFrom: undefined,
          dateTo: "2017-01-20",
          label: "Full Run"
        }
      ],
      openingTimes: [
        { day: 1, from: "09:00", to: "18:00", timesRangeId: "full-run" }
      ],
      performances: [{ day: 1, at: "18:00" }],
      additionalOpeningTimes: [
        { date: "2016-02-11", from: "09:00", to: "18:00" }
      ],
      additionalPerformances: [{ date: "2016-02-11", at: "15:00" }],
      specialOpeningTimes: [
        {
          date: "2016-02-11",
          from: "09:00",
          to: "18:00",
          audienceTags: [{ id: "audience/adult", label: "Adult" }]
        }
      ],
      specialPerformances: [
        {
          date: "2016-02-11",
          at: "15:00",
          audienceTags: [{ id: "audience/adult", label: "Adult" }]
        }
      ],
      openingTimesClosures: ["2016-12-25"],
      performancesClosures: ["2016-12-26"],
      talents: [
        { id: "john-doe", roles: ["Director Actor"], characters: ["Polonius"] },
        { id: "jane-doe", roles: [], characters: undefined }
      ],
      audienceTags: [{ id: "audience/families", label: "families" }],
      mediumTags: [{ id: "medium/sculpture", label: "sculpture" }],
      styleTags: [{ id: "style/contemporary", label: "contemporary" }],
      geoTags: [{ id: "geo/europe", label: "europe" }],
      images: [
        {
          id: "abcd1234abcd1234abcd1234abcd1234",
          ratio: 1.2,
          copyright: "Foo",
          dominantColor: "af0900"
        }
      ],
      reviews: [{ source: "The Guardian", rating: 4 }],
      weSay: "something",
      soldOutPerformances: [{ date: "2017-01-20", at: "09:00" }],
      version: 1
    });
  });

  it("should apply event normalisers to minimal params", () => {
    const params = {
      name: "Taming of the Shrew",
      summary: "A contemporary update of this Shakespeare classic",
      description: "  ",
      descriptionCredit: "   ",
      links: [],
      duration: "  ",
      venueGuidance: "   ",
      timesRanges: [],
      openingTimes: [],
      performances: [],
      additionalOpeningTimes: [],
      additionalPerformances: [],
      specialOpeningTimes: [],
      specialPerformances: [],
      openingTimesClosures: [],
      performancesClosures: [],
      talents: [],
      audienceTags: [],
      mediumTags: [],
      styleTags: [],
      geoTags: [],
      images: [],
      reviews: [],
      weSay: "    ",
      soldOutPerformances: [],
      version: 1
    };

    const result = normaliser.normaliseCreateOrUpdateEventRequest(params);

    expect(result).toEqual({
      name: "Taming of the Shrew",
      summary: "A contemporary update of this Shakespeare classic",
      description: undefined,
      descriptionCredit: undefined,
      links: undefined,
      duration: undefined,
      venueGuidance: undefined,
      timesRanges: undefined,
      openingTimes: undefined,
      performances: undefined,
      additionalOpeningTimes: undefined,
      additionalPerformances: undefined,
      specialOpeningTimes: undefined,
      specialPerformances: undefined,
      openingTimesClosures: undefined,
      performancesClosures: undefined,
      talents: undefined,
      audienceTags: undefined,
      mediumTags: undefined,
      styleTags: undefined,
      geoTags: undefined,
      images: undefined,
      reviews: undefined,
      weSay: undefined,
      soldOutPerformances: undefined,
      version: 1
    });
  });

  it("should apply event normalisers to times audience tags", () => {
    const params = {
      name: "Taming of the Shrew",
      summary: "A contemporary update of this Shakespeare classic",
      description:
        "<p>A contemporary update of this Shakespeare classic by the acclaimed director Sam Mendes.</p>",
      descriptionCredit: "   ",
      links: [],
      duration: "  ",
      venueGuidance: "   ",
      openingTimes: [],
      performances: [],
      specialOpeningTimes: [
        { date: "2016-02-11", from: "09:00", to: "18:00", audienceTags: [] }
      ],
      specialPerformances: [
        { date: "2016-02-11", at: "15:00", audienceTags: [] }
      ],
      closures: [],
      talents: [],
      audienceTags: [],
      mediumTags: [],
      styleTags: [],
      geoTags: [],
      images: [
        {
          id: "abcd1234abcd1234abcd1234abcd1234",
          ratio: 1.2,
          copyright: "  ",
          dominantColor: " "
        }
      ],
      weSay: "    ",
      version: 1
    };

    const result = normaliser.normaliseCreateOrUpdateEventRequest(params);

    expect(result.specialOpeningTimes[0].audienceTags).toEqual(undefined);
    expect(result.specialPerformances[0].audienceTags).toEqual(undefined);
    expect(result.images[0].copyright).toEqual(undefined);
    expect(result.images[0].dominantColor).toEqual(undefined);
  });
});
