import deepFreeze from "deep-freeze-strict";
import * as normaliser from "./normaliser";

describe("normaliseAddImageRequest", () => {
  test.each([
    [{ type: "Venue", id: "12-34-56" }, { type: "venue", id: "123456" }]
  ])("%o should be normalised to %o", (request, expected) => {
    request = deepFreeze(request);
    const result = normaliser.normaliseAddImageRequest(request);
    expect(result).toEqual(expected);
  });
});
