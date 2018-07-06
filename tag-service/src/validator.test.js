import * as validator from "./validator";
import * as tagType from "./tag-type";

describe("validateCreateTagRequest", () => {
  it("should allow a valid request", () => {
    const request = { tagType: tagType.AUDIENCE, label: "Families" };
    expect(() => validator.validateCreateTagRequest(request)).not.toThrow();
  });

  it("should throw on an invalid request", () => {
    const request = {
      tagType: tagType.AUDIENCE,
      label: "FamiliesFamiliesFamiliesFamiliesFamiliesFamiliesFamilies"
    };
    expect(() => validator.validateCreateTagRequest(request)).toThrow(
      /Bad Request/
    );
  });
});
