import * as idGenerator from "./id-generator";
import * as tagType from "./tag-type";

describe("createTagId", () => {
  test.each([
    [tagType.GEO, "Furious Five", "geo/furious-five"],
    [tagType.MEDIUM, "theatre", "medium/theatre"]
  ])(".createTagId(%s, %s)", (type, label, expected) => {
    expect(idGenerator.createTagId(type, label)).toEqual(expected);
  });
});
