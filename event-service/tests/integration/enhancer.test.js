import deepFreeze from "deep-freeze-strict";
import * as enhancer from "../../src/enhancer";

const WIKIPEDIA_LINK = {
  type: "Wikipedia",
  url: "https://en.wikipedia.org/wiki/Rabbit"
};

describe("enhanceDescription", () => {
  it("should not get a wikipedia description when a description already exists", async () => {
    const params = deepFreeze({
      links: [WIKIPEDIA_LINK],
      description: "Some description"
    });
    const result = await enhancer.enhanceDescription(params);
    expect(result).toEqual(params);
  });

  it("should get a wikipedia description", async () => {
    const params = deepFreeze({ links: [WIKIPEDIA_LINK] });
    const result = await enhancer.enhanceDescription(params);
    expect(result).toEqual({
      links: [WIKIPEDIA_LINK],
      description: expect.stringContaining("Leporidae"),
      descriptionCredit: "Wikipedia"
    });
  });
});
