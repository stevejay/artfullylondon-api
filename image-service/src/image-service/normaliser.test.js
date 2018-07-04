import deepFreeze from "deep-freeze-strict";
import * as normaliser from "./normaliser";
import * as imageType from "../types/image-type";

describe("normaliseAddImageRequest", () => {
  test.each([
    [
      { type: imageType.VENUE, id: "12-34-56" },
      { type: imageType.VENUE, id: "123456" }
    ]
  ])("%o should be normalised to %o", (request, expected) => {
    const result = normaliser.normaliseAddImageRequest(deepFreeze(request));
    expect(result).toEqual(expected);
  });
});
