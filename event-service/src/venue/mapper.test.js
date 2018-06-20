import * as testData from "../../tests/utils/test-data";
import * as mapper from "./mapper";
import * as timeUtils from "../time-utils";

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
      status: "Active",
      venueType: "Art Gallery",
      description: "Wikipedia description",
      descriptionCredit: "Wikipedia credit",
      address: "Bankside\nLondon",
      postcode: "SW1 2ER",
      latitude: 51.5398,
      longitude: -0.109,
      wheelchairAccessType: "FullAccess",
      disabledBathroomType: "Present",
      hearingFacilitiesType: "HearingLoops",
      hasPermanentCollection: true,
      email: "boxoffice@tate.co.uk",
      telephone: "020 7359 4404",
      openingTimes: [
        { day: 0, from: "09:00", to: "18:00" },
        { day: 1, from: "09:00", to: "18:00" }
      ],
      additionalOpeningTimes: [
        { date: "2016/02/12", from: "23:00", to: "23:30" }
      ],
      openingTimesClosures: [{ date: "2016/02/10" }, { date: "2016/02/11" }],
      namedClosures: ["ChristmasDay", "NewYearsDay"],
      links: [{ type: "Wikipedia", url: "https://en.wikipedia.org/foo" }],
      images: [
        {
          id: "abcd1234abcd1234abcd1234abcd1234",
          ratio: 1.2,
          copyright: "Foo"
        }
      ],
      weSay: "something",
      notes: "hi",
      version: 1,
      schemeVersion: mapper.CURRENT_VENUE_SCHEME_VERSION,
      createdDate: "2016/01/10",
      updatedDate: "2016/01/11"
    });
  });

  it("should map a minimally populated request", () => {
    const request = testData.createMinimalRequestVenue();

    const result = mapper.mapCreateOrUpdateVenueRequest({
      ...request,
      id: testData.MINIMAL_VENUE_ID,
      description: "Wikipedia description"
    });

    expect(result).toEqual({
      id: testData.MINIMAL_VENUE_ID,
      name: "Almeida Theatre",
      status: "Active",
      venueType: "Theatre",
      address: "Almeida St\nIslington",
      postcode: "N1 1TA",
      latitude: 51.539464,
      longitude: -0.103103,
      description: "Wiki description",
      wheelchairAccessType: "FullAccess",
      disabledBathroomType: "Present",
      hearingFacilitiesType: "HearingLoops",
      hasPermanentCollection: true,
      version: 2,
      schemeVersion: mapper.CURRENT_VENUE_SCHEME_VERSION,
      createdDate: "2016/01/10",
      updatedDate: "2016/01/11"
    });
  });
});

describe("mapToAdminResponse", () => {
  it("should map a fully populated db item", () => {
    const item = testData.createFullDbVenue();

    const result = mapper.mapToAdminResponse(item);

    expect(result).toEqual({
      id: testData.FULL_VENUE_ID,
      name: "Tate Modern",
      status: "Active",
      venueType: "Art Gallery",
      description: "Some description",
      descriptionCredit: "Some description credit",
      address: "Bankside\nLondon",
      postcode: "SW1 2ER",
      latitude: 51.5398,
      longitude: -0.109,
      wheelchairAccessType: "FullAccess",
      disabledBathroomType: "Present",
      hearingFacilitiesType: "HearingLoops",
      hasPermanentCollection: true,
      email: "boxoffice@tate.co.uk",
      telephone: "020 7359 4404",
      openingTimes: [
        { day: 0, from: "09:00", to: "18:00" },
        { day: 1, from: "09:00", to: "18:00" }
      ],
      additionalOpeningTimes: [
        { date: "2016/02/12", from: "23:00", to: "23:30" }
      ],
      openingTimesClosures: [{ date: "2016/02/10" }, { date: "2016/02/11" }],
      namedClosures: ["ChristmasDay", "NewYearsDay"],
      links: [{ type: "Wikipedia", url: "https://en.wikipedia.org/foo" }],
      images: [
        {
          id: "abcd1234abcd1234abcd1234abcd1234",
          ratio: 1.2,
          copyright: "Foo"
        }
      ],
      weSay: "something",
      notes: "hi",
      version: 1,
      schemeVersion: mapper.CURRENT_VENUE_SCHEME_VERSION,
      createdDate: "2016/01/10",
      updatedDate: "2016/01/11"
    });
  });

  it("should map a minimally populated db item", () => {
    const item = testData.createMinimalDbVenue();

    const result = mapper.mapToAdminResponse(item);

    expect(result).toEqual({
      id: testData.MINIMAL_VENUE_ID,
      name: "Almeida Theatre",
      status: "Active",
      venueType: "Theatre",
      address: "Almeida St\nIslington",
      postcode: "N1 1TA",
      latitude: 51.539464,
      longitude: -0.103103,
      wheelchairAccessType: "FullAccess",
      disabledBathroomType: "Present",
      hearingFacilitiesType: "HearingLoops",
      hasPermanentCollection: false,
      version: 1,
      schemeVersion: mapper.CURRENT_VENUE_SCHEME_VERSION,
      createdDate: "2016/01/10",
      updatedDate: "2016/01/11"
    });
  });
});

describe("mapToPublicSummaryResponse", () => {
  it("should map a fully populated db item", () => {
    const item = testData.createFullDbVenue();

    const result = mapper.mapToPublicSummaryResponse(item);

    expect(result).toEqual({
      entityType: "venue",
      id: testData.FULL_VENUE_ID,
      status: "Active",
      name: "Tate Modern",
      venueType: "Art Gallery",
      address: "Bankside\nLondon",
      postcode: "SW1 2ER",
      latitude: 51.5398,
      longitude: -0.109,
      image: "abcd1234abcd1234abcd1234abcd1234",
      imageCopyright: "Foo",
      imageRatio: 1.2
    });
  });

  it("should map a minimally populated db item", () => {
    const item = testData.createMinimalDbVenue();

    const result = mapper.mapToPublicSummaryResponse(item);

    expect(result).toEqual({
      entityType: "venue",
      id: testData.MINIMAL_VENUE_ID,
      status: "Active",
      name: "Almeida Theatre",
      venueType: "Theatre",
      address: "Almeida St\nIslington",
      postcode: "N1 1TA",
      latitude: 51.539464,
      longitude: -0.103103
    });
  });
});

describe("mapToPublicFullResponse", () => {
  it("should map a fully populated db item", () => {
    const item = testData.createFullDbVenue();

    const result = mapper.mapToPublicFullResponse(item);

    expect(result).toEqual({
      entityType: "venue",
      id: testData.FULL_VENUE_ID,
      status: "Active",
      name: "Tate Modern",
      venueType: "Art Gallery",
      address: "Bankside\nLondon",
      postcode: "SW1 2ER",
      latitude: 51.5398,
      longitude: -0.109,
      image: "abcd1234abcd1234abcd1234abcd1234",
      imageCopyright: "Foo",
      imageRatio: 1.2,
      wheelchairAccessType: "FullAccess",
      disabledBathroomType: "Present",
      hearingFacilitiesType: "HearingLoops",
      hasPermanentCollection: true,
      description: "Some description",
      descriptionCredit: "Some description credit",
      email: "boxoffice@tate.co.uk",
      telephone: "020 7359 4404",
      weSay: "something",
      notes: "hi",
      openingTimes: [
        { day: 0, from: "09:00", to: "18:00" },
        { day: 1, from: "09:00", to: "18:00" }
      ],
      additionalOpeningTimes: [
        { date: "2016/02/12", from: "23:00", to: "23:30" }
      ],
      openingTimesClosures: [{ date: "2016/02/10" }, { date: "2016/02/11" }],
      namedClosures: ["ChristmasDay", "NewYearsDay"],
      links: [{ type: "Wikipedia", url: "https://en.wikipedia.org/foo" }],
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

    const result = mapper.mapToPublicFullResponse(item);

    expect(result).toEqual({
      entityType: "venue",
      id: testData.MINIMAL_VENUE_ID,
      status: "Active",
      name: "Almeida Theatre",
      venueType: "Theatre",
      address: "Almeida St\nIslington",
      postcode: "N1 1TA",
      latitude: 51.539464,
      longitude: -0.103103,
      wheelchairAccessType: "FullAccess",
      disabledBathroomType: "Present",
      hearingFacilitiesType: "HearingLoops",
      hasPermanentCollection: false
    });
  });
});
