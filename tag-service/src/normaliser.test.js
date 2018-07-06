import deepFreeze from "deep-freeze-strict";
import * as normaliser from "./normaliser";
import * as tagType from "./tag-type";

describe("normaliseCreateTagRequest", () => {
  test.each([
    [
      { tagType: tagType.AUDIENCE, label: " The     Family   " },
      { tagType: tagType.AUDIENCE, label: "the family" }
    ]
  ])("%s should be normalised to %s", (request, expected) => {
    const result = normaliser.normaliseCreateTagRequest(deepFreeze(request));
    expect(result).toEqual(expected);
  });
});
