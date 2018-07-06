import * as normaliser from "./normaliser";
import * as linkType from "../types/link-type";
import * as statusType from "../types/status-type";
import * as talentType from "../types/talent-type";

describe("talent normaliser", () => {
  it("should normalise a fully populated individual talent", () => {
    const request = {
      firstNames: " Anne  ",
      lastName: "   Trixy Stage",
      status: statusType.ACTIVE,
      talentType: talentType.INDIVIDUAL,
      commonRole: "Actor   ",
      description: "  An actor.  ",
      descriptionCredit: " Credit  ",
      links: [
        { type: linkType.WIKIPEDIA, url: "   https://en.wikipedia.org/foo  " }
      ],
      images: [
        {
          id: "abcd1234abcd1234abcd1234abcd1234",
          ratio: 1.2,
          copyright: " Foo  "
        }
      ],
      weSay: "   something   ",
      version: 3
    };

    const result = normaliser.normaliseCreateOrUpdateTalentRequest(request);

    expect(result).toEqual({
      firstNames: "Anne",
      lastName: "Trixy Stage",
      status: statusType.ACTIVE,
      talentType: talentType.INDIVIDUAL,
      commonRole: "Actor",
      description: "An actor.",
      descriptionCredit: "Credit",
      links: [
        { type: linkType.WIKIPEDIA, url: "https://en.wikipedia.org/foo" }
      ],
      images: [
        {
          id: "abcd1234abcd1234abcd1234abcd1234",
          ratio: 1.2,
          copyright: "Foo",
          dominantColor: undefined
        }
      ],
      weSay: "something",
      version: 3
    });
  });

  it("should normalise a minimally populated individual talent", () => {
    const request = {
      firstNames: "",
      lastName: "Stage",
      status: statusType.ACTIVE,
      talentType: talentType.INDIVIDUAL,
      commonRole: "Actor",
      version: 3
    };

    const result = normaliser.normaliseCreateOrUpdateTalentRequest(request);

    expect(result).toEqual({
      firstNames: undefined,
      lastName: "Stage",
      status: statusType.ACTIVE,
      talentType: talentType.INDIVIDUAL,
      commonRole: "Actor",
      description: undefined,
      descriptionCredit: undefined,
      links: undefined,
      images: undefined,
      weSay: undefined,
      version: 3
    });
  });
});
