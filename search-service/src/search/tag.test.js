import * as tag from "./tag";

describe("createTagIdForMediumWithStyleTag", () => {
  it("should create the tag id", () => {
    const actual = tag.createTagIdForMediumWithStyleTag(
      "medium/painting",
      "style/contemporary"
    );

    expect(actual).toEqual("medium/painting/contemporary");
  });
});
