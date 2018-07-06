import * as mapper from "./mapper";
import * as tagType from "./tag-type";

describe("mapCreateTagRequest", () => {
  it("should map correctly", () => {
    const request = { tagType: tagType.GEO, label: "usa" };
    const result = mapper.mapCreateTagRequest(request);
    expect(result).toEqual({
      tagType: tagType.GEO,
      id: "geo/usa",
      label: "usa"
    });
  });
});
