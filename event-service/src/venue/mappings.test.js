"use strict";

const testData = require("../test-data");
const constants = require("./constants");
const mappings = require("./mappings");
const date = require("../date");

describe("venue mappings", () => {
  describe("mapRequestToDbItem", () => {
    beforeEach(() => {
      date.getTodayAsStringDate = jest.fn().mockReturnValue("2016/01/11");
    });

    it("should map a fully populated request", () => {
      const request = testData.createFullRequestVenue();
      delete request.description;
      delete request.descriptionCredit;

      const result = mappings.mapRequestToDbItem(
        testData.FULL_VENUE_ID,
        request,
        { content: "Wikipedia description", credit: "Wikipedia credit" }
      );

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
        schemeVersion: constants.CURRENT_VENUE_SCHEME_VERSION,
        createdDate: "2016/01/10",
        updatedDate: "2016/01/11"
      });
    });

    it("should map a minimally populated request", () => {
      const request = testData.createMinimalRequestVenue();

      const result = mappings.mapRequestToDbItem(
        testData.MINIMAL_VENUE_ID,
        request,
        { content: "Wiki description" }
      );

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
        schemeVersion: constants.CURRENT_VENUE_SCHEME_VERSION,
        createdDate: "2016/01/10",
        updatedDate: "2016/01/11"
      });
    });
  });

  describe("mapDbItemToAdminResponse", () => {
    it("should map a fully populated db item", () => {
      const item = testData.createFullDbVenue();

      const result = mappings.mapDbItemToAdminResponse(item);

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
        schemeVersion: constants.CURRENT_VENUE_SCHEME_VERSION,
        createdDate: "2016/01/10",
        updatedDate: "2016/01/11"
      });
    });

    it("should map a minimally populated db item", () => {
      const item = testData.createMinimalDbVenue();

      const result = mappings.mapDbItemToAdminResponse(item);

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
        schemeVersion: constants.CURRENT_VENUE_SCHEME_VERSION,
        createdDate: "2016/01/10",
        updatedDate: "2016/01/11"
      });
    });
  });

  describe("mapDbItemToPublicSummaryResponse", () => {
    it("should map a fully populated db item", () => {
      const item = testData.createFullDbVenue();

      const result = mappings.mapDbItemToPublicSummaryResponse(item);

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

      const result = mappings.mapDbItemToPublicSummaryResponse(item);

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

  describe("mapDbItemToPublicResponse", () => {
    it("should map a fully populated db item", () => {
      const item = testData.createFullDbVenue();

      const result = mappings.mapDbItemToPublicResponse(item);

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

      const result = mappings.mapDbItemToPublicResponse(item);

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

  describe("mapDbItemToFullSearchIndex", () => {
    it("should map a fully populated db item", () => {
      const response = testData.createFullDbVenue();

      const result = mappings.mapDbItemToFullSearchIndex(response);

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
        name_sort: "tate modern",
        locationOptimized: { lat: 51.5398, lon: -0.109 },
        version: 1
      });
    });

    it("should map a minimally populated db item", () => {
      const response = testData.createMinimalDbVenue();

      const result = mappings.mapDbItemToFullSearchIndex(response);

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
        name_sort: "almeida theatre",
        locationOptimized: { lat: 51.539464, lon: -0.103103 },
        version: 1
      });
    });
  });

  describe("mapDbItemToAutocompleteSearchIndex", () => {
    it("should map a fully populated db item", () => {
      const response = testData.createFullDbVenue();

      const result = mappings.mapDbItemToAutocompleteSearchIndex(response);

      expect(result).toEqual({
        nameSuggest: ["tate modern"],
        output: "Tate Modern",
        id: testData.FULL_VENUE_ID,
        status: "Active",
        venueType: "Art Gallery",
        address: "Bankside\nLondon",
        postcode: "SW1 2ER",
        entityType: "venue",
        version: 1
      });
    });

    it("should map a minimally populated db item", () => {
      const response = testData.createMinimalDbVenue();

      const result = mappings.mapDbItemToAutocompleteSearchIndex(response);

      expect(result).toEqual({
        nameSuggest: ["almeida theatre"],
        output: "Almeida Theatre",
        id: testData.MINIMAL_VENUE_ID,
        status: "Active",
        venueType: "Theatre",
        address: "Almeida St\nIslington",
        postcode: "N1 1TA",
        entityType: "venue",
        version: 1
      });
    });
  });
});
