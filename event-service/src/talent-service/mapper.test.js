import * as testData from "../../tests/utils/test-data";
import * as mapper from "./mapper";
import * as timeUtils from "../entity/time-utils";
import * as entityType from "../types/entity-type";
import * as linkType from "../types/link-type";
import * as statusType from "../types/status-type";
import * as talentType from "../types/talent-type";

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
      status: statusType.ACTIVE,
      talentType: talentType.INDIVIDUAL,
      commonRole: "Actor",
      description: "Wikipedia description",
      descriptionCredit: "Wikipedia credit",
      links: [
        { type: linkType.WIKIPEDIA, url: "https://en.wikipedia.org/foo" }
      ],
      images: [
        {
          id: "0342826208934d90b801e055152f1d0f",
          ratio: 1.2,
          copyright: "Tate Modern"
        }
      ],
      weSay: "something",
      notes: "some notes",
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
      id: testData.INDIVIDUAL_TALENT_ID
    });

    expect(result).toEqual({
      id: testData.INDIVIDUAL_TALENT_ID,
      firstNames: "Carrie",
      lastName: "Cracknell",
      status: statusType.ACTIVE,
      talentType: talentType.INDIVIDUAL,
      commonRole: "Actor",
      version: 3,
      schemeVersion: mapper.CURRENT_TALENT_SCHEME_VERSION,
      createdDate: "2016-01-10",
      updatedDate: "2016-01-11"
    });
  });

  it("should map a fully populated request for a group talent", () => {
    const request = testData.createFullGroupRequestTalent();

    const result = mapper.mapCreateOrUpdateTalentRequest({
      ...request,
      id: testData.GROUP_TALENT_ID,
      description: "Wikipedia description",
      descriptionCredit: "Wikipedia credit"
    });

    expect(result).toEqual({
      id: testData.GROUP_TALENT_ID,
      lastName: "The Darkness",
      status: statusType.ACTIVE,
      talentType: talentType.GROUP,
      commonRole: "Artist",
      description: "Wikipedia description",
      descriptionCredit: "Wikipedia credit",
      links: [
        { type: linkType.WIKIPEDIA, url: "https://en.wikipedia.org/foo" }
      ],
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

describe("mapResponse", () => {
  it("should map a fully populated db item for an individual talent", () => {
    const dbTalent = testData.createFullIndividualDbTalent();
    const result = mapper.mapResponse(dbTalent);
    expect(result).toEqual({
      entityType: entityType.TALENT,
      status: statusType.ACTIVE,
      id: testData.INDIVIDUAL_TALENT_ID,
      lastName: "Cracknell",
      talentType: talentType.INDIVIDUAL,
      commonRole: "Actor",
      mainImage: {
        id: "0342826208934d90b801e055152f1d0f",
        copyright: "Tate Modern",
        ratio: 1.2
      },
      firstNames: "Carrie",
      description: "An actor.",
      descriptionCredit: "Description credit",
      weSay: "something",
      links: [
        { type: linkType.WIKIPEDIA, url: "https://en.wikipedia.org/foo" }
      ],
      images: [
        {
          id: "0342826208934d90b801e055152f1d0f",
          ratio: 1.2,
          copyright: "Tate Modern"
        }
      ],
      version: 3,
      schemeVersion: mapper.CURRENT_TALENT_SCHEME_VERSION,
      createdDate: "2016-01-10",
      updatedDate: "2016-01-11"
    });
  });

  it("should map a minimally populated db item for an individual talent", () => {
    const dbTalent = testData.createMinimalIndividualDbTalent();
    const result = mapper.mapResponse(dbTalent);
    expect(result).toEqual({
      entityType: entityType.TALENT,
      status: statusType.ACTIVE,
      id: testData.INDIVIDUAL_TALENT_ID,
      lastName: "Cracknell",
      talentType: talentType.INDIVIDUAL,
      commonRole: "Actor",
      firstNames: "Carrie",
      version: 3,
      schemeVersion: mapper.CURRENT_TALENT_SCHEME_VERSION,
      createdDate: "2016-01-10",
      updatedDate: "2016-01-11"
    });
  });

  it("should map a minimally populated db item for a group talent", () => {
    const dbTalent = testData.createMinimalGroupDbTalent();
    const result = mapper.mapResponse(dbTalent);
    expect(result).toEqual({
      entityType: entityType.TALENT,
      status: statusType.ACTIVE,
      id: testData.GROUP_TALENT_ID,
      lastName: "The Darkness",
      talentType: talentType.GROUP,
      commonRole: "Artist",
      version: 1,
      schemeVersion: mapper.CURRENT_TALENT_SCHEME_VERSION,
      createdDate: "2016-01-10",
      updatedDate: "2016-01-11"
    });
  });
});
