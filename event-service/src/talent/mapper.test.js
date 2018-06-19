import * as testData from "../test-data";
import * as mapper from "./mapper";
import * as timeUtils from "../time-utils";

describe("mapCreateOrUpdateTalentRequest", () => {
  beforeEach(() => {
    timeUtils.getCreatedDateForDB = jest.fn().mockReturnValue("2016-01-11");
  });

  it("should map a fully populated individual talent request", () => {
    const request = testData.createFullIndividualRequestTalent();

    const result = mapper.mapCreateOrUpdateTalentRequest({
      ...request,
      id: testData.INDIVIDUAL_TALENT_ID,
      description: "Wikipedia description",
      descriptionCredit: "Wikipedia credit"
    });

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
      schemeVersion: mapper.CURRENT_TALENT_SCHEME_VERSION,
      createdDate: "2016-01-10",
      updatedDate: "2016-01-11"
    });
  });

  it("should map a minimally populated individual talent request", () => {
    const request = testData.createMinimalIndividualRequestTalent();

    const result = mapper.mapCreateOrUpdateTalentRequest({
      ...request,
      id: testData.INDIVIDUAL_TALENT_ID,
      description: "Wikipedia description"
    });

    expect(result).toEqual({
      id: testData.INDIVIDUAL_TALENT_ID,
      firstNames: "Carrie",
      lastName: "Cracknell",
      status: "Active",
      talentType: "Individual",
      commonRole: "Actor",
      version: 3,
      schemeVersion: mapper.CURRENT_TALENT_SCHEME_VERSION,
      createdDate: "2016-01-10",
      updatedDate: "2016-01-11"
    });
  });

  it("should map a fully populated request for a group talent", () => {
    const request = testData.createFullGroupRequestTalent();

    const result = mapper.mapCreateOrUpdateTalentRequest(
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
      schemeVersion: mapper.CURRENT_TALENT_SCHEME_VERSION,
      createdDate: "2016-01-10",
      updatedDate: "2016-01-11"
    });
  });
});

describe("mapToPublicSummaryResponse", () => {
  it("should map a fully populated db item for an individual talent", () => {
    const response = testData.createFullIndividualDbTalent();

    const result = mapper.mapToPublicSummaryResponse(response);

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

    const result = mapper.mapToPublicSummaryResponse(response);

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

    const result = mapper.mapToPublicSummaryResponse(response);

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

describe("mapToPublicFullResponse", () => {
  it("should map a fully populated db item for an individual talent", () => {
    const response = testData.createFullIndividualDbTalent();

    const result = mapper.mapToPublicFullResponse(response);

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

    const result = mapper.mapToPublicFullResponse(response);

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

    const result = mapper.mapToPublicFullResponse(response);

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
