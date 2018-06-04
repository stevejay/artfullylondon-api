import * as validator from "./validator";

describe("validateGetTagsByTypeRequest", () => {
  it("should allow a valid request", () => {
    const request = { tagType: "audience" };
    expect(() => validator.validateGetTagsByTypeRequest(request)).not.toThrow();
  });

  it("should throw on an invalid request", () => {
    const request = { tagType: "invalid" };
    expect(() => validator.validateGetTagsByTypeRequest(request)).toThrow(
      /Bad Request/
    );
  });
});

describe("validateCreateTagRequest", () => {
  it("should allow a valid request", () => {
    const request = { type: "audience", label: "Families" };
    expect(() => validator.validateCreateTagRequest(request)).not.toThrow();
  });

  it("should throw on an invalid request", () => {
    const request = { type: "invalid", label: "Families" };
    expect(() => validator.validateCreateTagRequest(request)).toThrow(
      /Bad Request/
    );
  });
});
