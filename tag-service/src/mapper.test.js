import * as mapper from "./mapper";

describe("mapCreateTagRequest", () => {
  it("should map correctly", () => {
    const request = { tagType: "geo", label: "usa" };
    const result = mapper.mapCreateTagRequest(request);
    expect(result).toEqual({
      id: "geo/usa",
      tagType: "geo",
      label: "usa"
    });
  });
});

describe("mapDeleteTagRequest", () => {
  it("should map correctly", () => {
    const request = { id: "geo/usa" };
    const result = mapper.mapDeleteTagRequest(request);
    expect(result).toEqual({
      id: "geo/usa",
      tagType: "geo"
    });
  });
});
