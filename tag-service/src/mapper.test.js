import * as mapper from "./mapper";

describe("mapCreateTagRequest", () => {
  it("should map correctly", () => {
    const request = { type: "geo", label: "usa" };
    const result = mapper.mapCreateTagRequest(request);

    expect(result).toEqual({
      id: "geo/usa",
      tagType: "geo",
      label: "usa"
    });
  });
});

describe("mapSingleTagResponse", () => {
  it("should map correctly", () => {
    const dbTag = { id: "geo/usa", tagType: "geo", label: "usa" };
    const result = mapper.mapSingleTagResponse(dbTag);

    expect(result).toEqual({
      tag: {
        id: "geo/usa",
        label: "usa"
      }
    });
  });
});

describe("mapMultiTagsResponse", () => {
  it("should map one type of tag", () => {
    const dbResponse = [
      { id: "audience/a", label: "a" },
      { id: "audience/b", label: "b" }
    ];

    const result = mapper.mapMultiTagsResponse(dbResponse);

    expect(result).toEqual({
      tags: {
        audience: [
          { id: "audience/a", label: "a" },
          { id: "audience/b", label: "b" }
        ]
      }
    });
  });

  it("should map multiple types of tag", () => {
    const dbResponse = [
      { id: "audience/a", label: "a" },
      { id: "geo/c", label: "c" },
      { id: "audience/b", label: "b" }
    ];

    const result = mapper.mapMultiTagsResponse(dbResponse);

    expect(result).toEqual({
      tags: {
        audience: [
          { id: "audience/a", label: "a" },
          { id: "audience/b", label: "b" }
        ],
        geo: [{ id: "geo/c", label: "c" }]
      }
    });
  });
});
