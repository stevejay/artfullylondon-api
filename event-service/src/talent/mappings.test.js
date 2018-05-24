"use strict";

const testData = require("../test-data");
const constants = require("./constants");
const mappings = require("./mappings");
const date = require("../date");

describe("talent mappings", () => {
  describe("mapRequestToDbItem", () => {
    beforeEach(() => {
      date.getTodayAsStringDate = jest.fn().mockReturnValue("2016/01/11");
    });

    it("should map a fully populated individual talent request", () => {
      const request = testData.createFullIndividualRequestTalent();

      const result = mappings.mapRequestToDbItem(
        testData.INDIVIDUAL_TALENT_ID,
        request,
        { content: "Wikipedia content", credit: "Wikipedia credit" }
      );

      expect(result).toEqual({
        id: testData.INDIVIDUAL_TALENT_ID,
        firstNames: "Carrie",
        lastName: "Cracknell",
        status: "Active",
        talentType: "Individual",
        commonRole: "Actor",
        description: "Wikipedia content",
        descriptionCredit: "Wikipedia credit",
        links: [{ type: "Wikipedia", url: "https://en.wikipedia.org/foo" }],
        images: [
          {
            id: "0342826208934d90b801e055152f1d0f",
            ratio: 1.2,
            copyright: "Tate Modern"
          }
        ],
        weSay: "something",
        version: 3,
        schemeVersion: constants.CURRENT_TALENT_SCHEME_VERSION,
        createdDate: "2016/01/10",
        updatedDate: "2016/01/11"
      });
    });

    it("should map a minimally populated individual talent request", () => {
      const request = testData.createMinimalIndividualRequestTalent();

      const result = mappings.mapRequestToDbItem(
        testData.INDIVIDUAL_TALENT_ID,
        request,
        {}
      );

      expect(result).toEqual({
        id: testData.INDIVIDUAL_TALENT_ID,
        firstNames: "Carrie",
        lastName: "Cracknell",
        status: "Active",
        talentType: "Individual",
        commonRole: "Actor",
        version: 3,
        schemeVersion: constants.CURRENT_TALENT_SCHEME_VERSION,
        createdDate: "2016/01/10",
        updatedDate: "2016/01/11"
      });
    });

    it("should map a fully populated request for a group talent", () => {
      const request = testData.createFullGroupRequestTalent();

      const result = mappings.mapRequestToDbItem(
        testData.GROUP_TALENT_ID,
        request,
        { content: "Wikipedia description", credit: "Wikipedia credit" }
      );

      expect(result).toEqual({
        id: testData.GROUP_TALENT_ID,
        lastName: "The Darkness",
        status: "Active",
        talentType: "Group",
        commonRole: "Artist",
        description: "Wikipedia description",
        descriptionCredit: "Wikipedia credit",
        links: [{ type: "Wikipedia", url: "https://en.wikipedia.org/foo" }],
        images: [
          {
            id: "0342826208934d90b801e055152f1d0f",
            ratio: 1.2,
            copyright: "Tate Modern"
          }
        ],
        weSay: "something",
        version: 3,
        schemeVersion: constants.CURRENT_TALENT_SCHEME_VERSION,
        createdDate: "2016/01/10",
        updatedDate: "2016/01/11"
      });
    });
  });

  describe("mapDbItemToAdminResponse", () => {
    it("should map a fully populated db item for an individual talent", () => {
      const response = testData.createFullIndividualDbTalent();

      const result = mappings.mapDbItemToAdminResponse(response);

      expect(result).toEqual({
        status: "Active",
        id: testData.INDIVIDUAL_TALENT_ID,
        lastName: "Cracknell",
        talentType: "Individual",
        commonRole: "Actor",
        schemeVersion: constants.CURRENT_TALENT_SCHEME_VERSION,
        version: 3,
        createdDate: "2016/01/10",
        updatedDate: "2016/01/11",
        firstNames: "Carrie",
        description: "An actor.",
        descriptionCredit: "Description credit",
        weSay: "something",
        links: [{ type: "Wikipedia", url: "https://en.wikipedia.org/foo" }],
        images: [
          {
            id: "0342826208934d90b801e055152f1d0f",
            ratio: 1.2,
            copyright: "Tate Modern"
          }
        ]
      });
    });

    it("should map a minimally populated db item for an individual talent", () => {
      const response = testData.createMinimalIndividualDbTalent();

      const result = mappings.mapDbItemToAdminResponse(response);

      expect(result).toEqual({
        status: "Active",
        id: testData.INDIVIDUAL_TALENT_ID,
        firstNames: "Carrie",
        lastName: "Cracknell",
        talentType: "Individual",
        commonRole: "Actor",
        schemeVersion: constants.CURRENT_TALENT_SCHEME_VERSION,
        version: 3,
        createdDate: "2016/01/10",
        updatedDate: "2016/01/11"
      });
    });

    it("should map a minimally populated db item for a group talent", () => {
      const response = testData.createMinimalGroupDbTalent();

      const result = mappings.mapDbItemToAdminResponse(response);

      expect(result).toEqual({
        status: "Active",
        id: testData.GROUP_TALENT_ID,
        lastName: "The Darkness",
        talentType: "Group",
        commonRole: "Artist",
        schemeVersion: constants.CURRENT_TALENT_SCHEME_VERSION,
        version: 1,
        createdDate: "2016/01/10",
        updatedDate: "2016/01/11"
      });
    });
  });

  describe("mapDbItemToPublicSummaryResponse", () => {
    it("should map a fully populated db item for an individual talent", () => {
      const response = testData.createFullIndividualDbTalent();

      const result = mappings.mapDbItemToPublicSummaryResponse(response);

      expect(result).toEqual({
        entityType: "talent",
        status: "Active",
        id: testData.INDIVIDUAL_TALENT_ID,
        lastName: "Cracknell",
        talentType: "Individual",
        commonRole: "Actor",
        image: "0342826208934d90b801e055152f1d0f",
        imageCopyright: "Tate Modern",
        imageRatio: 1.2,
        firstNames: "Carrie"
      });
    });

    it("should map a minimally populated db item for an individual talent", () => {
      const response = testData.createMinimalIndividualDbTalent();

      const result = mappings.mapDbItemToPublicSummaryResponse(response);

      expect(result).toEqual({
        entityType: "talent",
        status: "Active",
        id: testData.INDIVIDUAL_TALENT_ID,
        lastName: "Cracknell",
        talentType: "Individual",
        commonRole: "Actor",
        firstNames: "Carrie"
      });
    });

    it("should map a minimally populated db item for a group talent", () => {
      const response = testData.createMinimalGroupDbTalent();

      const result = mappings.mapDbItemToPublicSummaryResponse(response);

      expect(result).toEqual({
        entityType: "talent",
        status: "Active",
        id: testData.GROUP_TALENT_ID,
        lastName: "The Darkness",
        talentType: "Group",
        commonRole: "Artist"
      });
    });
  });

  describe("mapDbItemToPublicResponse", () => {
    it("should map a fully populated db item for an individual talent", () => {
      const response = testData.createFullIndividualDbTalent();

      const result = mappings.mapDbItemToPublicResponse(response);

      expect(result).toEqual({
        entityType: "talent",
        status: "Active",
        id: testData.INDIVIDUAL_TALENT_ID,
        lastName: "Cracknell",
        talentType: "Individual",
        commonRole: "Actor",
        image: "0342826208934d90b801e055152f1d0f",
        imageCopyright: "Tate Modern",
        imageRatio: 1.2,
        firstNames: "Carrie",
        description: "An actor.",
        descriptionCredit: "Description credit",
        weSay: "something",
        links: [{ type: "Wikipedia", url: "https://en.wikipedia.org/foo" }],
        images: [
          {
            id: "0342826208934d90b801e055152f1d0f",
            ratio: 1.2,
            copyright: "Tate Modern"
          }
        ]
      });
    });

    it("should map a minimally populated db item for an individual talent", () => {
      const response = testData.createMinimalIndividualDbTalent();

      const result = mappings.mapDbItemToPublicResponse(response);

      expect(result).toEqual({
        entityType: "talent",
        status: "Active",
        id: testData.INDIVIDUAL_TALENT_ID,
        lastName: "Cracknell",
        talentType: "Individual",
        commonRole: "Actor",
        firstNames: "Carrie"
      });
    });

    it("should map a minimally populated db item for a group talent", () => {
      const response = testData.createMinimalGroupDbTalent();

      const result = mappings.mapDbItemToPublicResponse(response);

      expect(result).toEqual({
        entityType: "talent",
        status: "Active",
        id: testData.GROUP_TALENT_ID,
        lastName: "The Darkness",
        talentType: "Group",
        commonRole: "Artist"
      });
    });
  });

  describe("mapDbItemToFullSearchIndex", () => {
    it("should map a fully populated db item for an individual talent", () => {
      const response = testData.createFullIndividualDbTalent();

      const result = mappings.mapDbItemToFullSearchIndex(response);

      expect(result).toEqual({
        entityType: "talent",
        status: "Active",
        id: testData.INDIVIDUAL_TALENT_ID,
        lastName: "Cracknell",
        talentType: "Individual",
        commonRole: "Actor",
        image: "0342826208934d90b801e055152f1d0f",
        imageCopyright: "Tate Modern",
        imageRatio: 1.2,
        firstNames: "Carrie",
        lastName_sort: "cracknell",
        version: 3
      });
    });

    it("should map a minimally populated db item for an individual talent", () => {
      const response = testData.createMinimalIndividualDbTalent();

      const result = mappings.mapDbItemToFullSearchIndex(response);

      expect(result).toEqual({
        entityType: "talent",
        status: "Active",
        id: testData.INDIVIDUAL_TALENT_ID,
        lastName: "Cracknell",
        talentType: "Individual",
        commonRole: "Actor",
        firstNames: "Carrie",
        lastName_sort: "cracknell",
        version: 3
      });
    });

    it("should map a minimally populated db item for a group talent", () => {
      const response = testData.createMinimalGroupDbTalent();

      const result = mappings.mapDbItemToFullSearchIndex(response);

      expect(result).toEqual({
        entityType: "talent",
        status: "Active",
        id: testData.GROUP_TALENT_ID,
        lastName: "The Darkness",
        talentType: "Group",
        commonRole: "Artist",
        lastName_sort: "darkness",
        version: 1
      });
    });
  });

  describe("mapDbItemToAutocompleteSearchIndex", () => {
    it("should map a fully populated db item for individual talent", () => {
      const response = testData.createFullIndividualDbTalent();

      const result = mappings.mapDbItemToAutocompleteSearchIndex(response);

      expect(result).toEqual({
        nameSuggest: ["carrie cracknell", "cracknell"],
        output: "Carrie Cracknell",
        id: testData.INDIVIDUAL_TALENT_ID,
        status: "Active",
        talentType: "Individual",
        commonRole: "Actor",
        entityType: "talent",
        version: 3
      });
    });

    it("should map a fully populated db item for group talent", () => {
      const response = testData.createFullGroupDbTalent();

      const result = mappings.mapDbItemToAutocompleteSearchIndex(response);

      expect(result).toEqual({
        nameSuggest: ["the darkness", "darkness"],
        output: "The Darkness",
        id: testData.GROUP_TALENT_ID,
        status: "Active",
        talentType: "Group",
        commonRole: "Artist",
        entityType: "talent",
        version: 3
      });
    });
  });
});
