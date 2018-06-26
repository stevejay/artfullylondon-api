import deepFreeze from "deep-freeze-strict";
import * as normaliser from "./normaliser";

describe("normaliseCreateTagRequest", () => {
  test.each([
    [
      { tagType: " Audience  ", label: " The     Family   " },
      { tagType: "audience", label: "the family" }
    ]
  ])("%s should be normalised to %s", (request, expected) => {
    const result = normaliser.normaliseCreateTagRequest(deepFreeze(request));
    expect(result).toEqual(expected);
  });
});
