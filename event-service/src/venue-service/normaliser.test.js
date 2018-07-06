import * as normaliser from "./normaliser";
import * as disabledBathroomType from "../types/disabled-bathroom-type";
import * as hearingFacilitiesType from "../types/hearing-facilities-type";
import * as linkType from "../types/link-type";
import * as namedClosureType from "../types/named-closure-type";
import * as statusType from "../types/status-type";
import * as venueType from "../types/venue-type";
import * as wheelchairAccessType from "../types/wheelchair-access-type";

describe("venue normaliser", () => {
  it("should apply normalisers to a fully populated request", () => {
    const params = {
      name: "Almeida Theatre   ",
      status: statusType.ACTIVE,
      venueType: venueType.THEATRE,
      description: "   description   ",
      descriptionCredit: " Some credit   ",
      address: "Almeida St\n   Islington  ,  \r\nLondon",
      postcode: "n1   1ta",
      latitude: 51.539464,
      longitude: -0.103103,
      wheelchairAccessType: wheelchairAccessType.FULL_ACCESS,
      disabledBathroomType: disabledBathroomType.PRESENT,
      hearingFacilitiesType: hearingFacilitiesType.HEARING_LOOPS,
      email: "  boxoffice@almeida.co.uk",
      telephone: " (  020 ) 7359-4404",
      openingTimes: [{ day: 1, from: "09:00", to: "18:00" }],
      additionalOpeningTimes: [
        { date: "2016-02-12", from: "23:00", to: "23:30" }
      ],
      openingTimesClosures: [{ date: "2016-01-15" }],
      namedClosures: [
        namedClosureType.CHRISTMAS_DAY,
        namedClosureType.NEW_YEARS_DAY
      ],
      links: [
        { type: linkType.WIKIPEDIA, url: "  http://wikipedia.com/foo   " }
      ],
      images: [
        {
          id: "abcd1234abcd1234abcd1234abcd1234",
          ratio: 1.2,
          copyright: "  Foo  "
        }
      ],
      weSay: "   something  ",
      notes: "   a note   "
    };

    const result = normaliser.normaliseCreateOrUpdateVenueRequest(params);

    expect(result).toEqual({
      name: "Almeida Theatre",
      status: statusType.ACTIVE,
      venueType: venueType.THEATRE,
      description: "description",
      descriptionCredit: "Some credit",
      address: "Almeida St\nIslington\nLondon",
      postcode: "N1 1TA",
      latitude: 51.539464,
      longitude: -0.103103,
      wheelchairAccessType: wheelchairAccessType.FULL_ACCESS,
      disabledBathroomType: disabledBathroomType.PRESENT,
      hearingFacilitiesType: hearingFacilitiesType.HEARING_LOOPS,
      email: "boxoffice@almeida.co.uk",
      telephone: "020 7359 4404",
      openingTimes: [{ day: 1, from: "09:00", to: "18:00" }],
      additionalOpeningTimes: [
        { date: "2016-02-12", from: "23:00", to: "23:30" }
      ],
      openingTimesClosures: [{ date: "2016-01-15" }],
      namedClosures: [
        namedClosureType.CHRISTMAS_DAY,
        namedClosureType.NEW_YEARS_DAY
      ],
      links: [{ type: linkType.WIKIPEDIA, url: "http://wikipedia.com/foo" }],
      images: [
        {
          id: "abcd1234abcd1234abcd1234abcd1234",
          ratio: 1.2,
          copyright: "Foo",
          dominantColor: undefined
        }
      ],
      weSay: "something",
      notes: "a note"
    });
  });

  it("should apply normalisers to a minimally populated request", () => {
    const params = {
      name: "Almeida Theatre   ",
      status: statusType.ACTIVE,
      venueType: venueType.THEATRE,
      address: "Almeida St\n   Islington  ,  \r\nLondon",
      postcode: "n1   1ta",
      latitude: 51.539464,
      longitude: -0.103103,
      wheelchairAccessType: wheelchairAccessType.FULL_ACCESS,
      disabledBathroomType: disabledBathroomType.PRESENT,
      hearingFacilitiesType: hearingFacilitiesType.HEARING_LOOPS
    };

    const result = normaliser.normaliseCreateOrUpdateVenueRequest(params);

    expect(result).toEqual({
      name: "Almeida Theatre",
      status: statusType.ACTIVE,
      venueType: venueType.THEATRE,
      address: "Almeida St\nIslington\nLondon",
      postcode: "N1 1TA",
      latitude: 51.539464,
      longitude: -0.103103,
      wheelchairAccessType: wheelchairAccessType.FULL_ACCESS,
      disabledBathroomType: disabledBathroomType.PRESENT,
      hearingFacilitiesType: hearingFacilitiesType.HEARING_LOOPS,
      description: undefined,
      descriptionCredit: undefined,
      email: undefined,
      telephone: undefined,
      openingTimes: undefined,
      additionalOpeningTimes: undefined,
      openingTimesClosures: undefined,
      namedClosures: undefined,
      links: undefined,
      images: undefined,
      weSay: undefined,
      notes: undefined
    });
  });
});
