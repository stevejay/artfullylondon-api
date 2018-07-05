import * as testData from "../../tests/utils/test-data";
import * as mapper from "./mapper";
import * as timeUtils from "../entity/time-utils";
import * as disabledBathroomType from "../types/disabled-bathroom-type";
import * as hearingFacilitiesType from "../types/hearing-facilities-type";
import * as linkType from "../types/link-type";
import * as namedClosureType from "../types/named-closure-type";
import * as statusType from "../types/status-type";
import * as venueType from "../types/venue-type";
import * as wheelchairAccessType from "../types/wheelchair-access-type";

describe("mapCreateOrUpdateVenueRequest", () => {
  beforeEach(() => {
    timeUtils.getCreatedDateForDB = jest.fn().mockReturnValue("2016-01-11");
  });

  it("should map a fully populated request", () => {
    const request = testData.createFullRequestVenue();
    delete request.description;
    delete request.descriptionCredit;
    const result = mapper.mapCreateOrUpdateVenueRequest({
      ...request,
      id: testData.FULL_VENUE_ID,
      description: "Wikipedia description",
      descriptionCredit: "Wikipedia credit"
    });
    expect(result).toEqual({
      id: testData.FULL_VENUE_ID,
      name: "Tate Modern",
      status: statusType.ACTIVE,
      venueType: venueType.ART_GALLERY,
      description: "Wikipedia description",
      descriptionCredit: "Wikipedia credit",
      address: "Bankside\nLondon",
      postcode: "SW1 2ER",
      latitude: 51.5398,
      longitude: -0.109,
      wheelchairAccessType: wheelchairAccessType.FULL_ACCESS,
      disabledBathroomType: disabledBathroomType.PRESENT,
      hearingFacilitiesType: hearingFacilitiesType.HEARING_LOOPS,
      hasPermanentCollection: true,
      email: "boxoffice@tate.co.uk",
      telephone: "020 7359 4404",
      openingTimes: [
        { day: 1, from: "09:00", to: "18:00" },
        { day: 2, from: "09:00", to: "18:00" }
      ],
      additionalOpeningTimes: [
        { date: "2016-02-12", from: "23:00", to: "23:30" }
      ],
      openingTimesClosures: [{ date: "2016-02-10" }, { date: "2016-02-11" }],
      namedClosures: [
        namedClosureType.CHRISTMAS_DAY,
        namedClosureType.NEW_YEARS_DAY
      ],
      links: [
        { type: linkType.WIKIPEDIA, url: "https://en.wikipedia.org/foo" }
      ],
      images: [
        {
          id: "abcd1234abcd1234abcd1234abcd1234",
          ratio: 1.2,
          copyright: "Foo"
        }
      ],
      weSay: "something",
      notes: "some notes",
      version: 1,
      schemeVersion: mapper.CURRENT_VENUE_SCHEME_VERSION,
      createdDate: "2016-01-10",
      updatedDate: "2016-01-11"
    });
  });

  it("should map a minimally populated request", () => {
    const request = testData.createMinimalRequestVenue();
    const result = mapper.mapCreateOrUpdateVenueRequest({
      ...request,
      id: testData.MINIMAL_VENUE_ID
    });
    expect(result).toEqual({
      id: testData.MINIMAL_VENUE_ID,
      name: "Almeida Theatre",
      status: statusType.ACTIVE,
      venueType: venueType.THEATRE,
      address: "Almeida St\nIslington",
      postcode: "N1 1TA",
      latitude: 51.539464,
      longitude: -0.103103,
      wheelchairAccessType: wheelchairAccessType.FULL_ACCESS,
      disabledBathroomType: disabledBathroomType.PRESENT,
      hearingFacilitiesType: hearingFacilitiesType.HEARING_LOOPS,
      hasPermanentCollection: true,
      version: 2,
      schemeVersion: mapper.CURRENT_VENUE_SCHEME_VERSION,
      createdDate: "2016-01-10",
      updatedDate: "2016-01-11"
    });
  });
});

describe("mapResponse", () => {
  it("should map a fully populated db item", () => {
    const item = testData.createFullDbVenue();
    const result = mapper.mapResponse(item);
    expect(result).toEqual({
      id: testData.FULL_VENUE_ID,
      status: statusType.ACTIVE,
      name: "Tate Modern",
      venueType: venueType.ART_GALLERY,
      address: "Bankside\nLondon",
      postcode: "SW1 2ER",
      latitude: 51.5398,
      longitude: -0.109,
      mainImage: {
        id: "abcd1234abcd1234abcd1234abcd1234",
        copyright: "Foo",
        ratio: 1.2
      },
      wheelchairAccessType: wheelchairAccessType.FULL_ACCESS,
      disabledBathroomType: disabledBathroomType.PRESENT,
      hearingFacilitiesType: hearingFacilitiesType.HEARING_LOOPS,
      hasPermanentCollection: true,
      description: "Some description",
      descriptionCredit: "Some description credit",
      email: "boxoffice@tate.co.uk",
      telephone: "020 7359 4404",
      weSay: "something",
      notes: "some notes",
      openingTimes: [
        { day: 1, from: "09:00", to: "18:00" },
        { day: 2, from: "09:00", to: "18:00" }
      ],
      additionalOpeningTimes: [
        { date: "2016-02-12", from: "23:00", to: "23:30" }
      ],
      openingTimesClosures: [{ date: "2016-02-10" }, { date: "2016-02-11" }],
      namedClosures: [
        namedClosureType.CHRISTMAS_DAY,
        namedClosureType.NEW_YEARS_DAY
      ],
      links: [
        { type: linkType.WIKIPEDIA, url: "https://en.wikipedia.org/foo" }
      ],
      images: [
        {
          id: "abcd1234abcd1234abcd1234abcd1234",
          ratio: 1.2,
          copyright: "Foo"
        }
      ]
    });
  });

  it("should map a minimally populated db item", () => {
    const item = testData.createMinimalDbVenue();
    const result = mapper.mapResponse(item);
    expect(result).toEqual({
      id: testData.MINIMAL_VENUE_ID,
      status: statusType.ACTIVE,
      name: "Almeida Theatre",
      venueType: venueType.THEATRE,
      address: "Almeida St\nIslington",
      postcode: "N1 1TA",
      latitude: 51.539464,
      longitude: -0.103103,
      wheelchairAccessType: wheelchairAccessType.FULL_ACCESS,
      disabledBathroomType: disabledBathroomType.PRESENT,
      hearingFacilitiesType: hearingFacilitiesType.HEARING_LOOPS
    });
  });
});
