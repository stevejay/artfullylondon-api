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

describe("mapLambdaEvent", () => {
  it("should map a type only event", () => {
    const event = { pathParameters: { type: "audience" } };
    const actual = mapper.mapLambdaEvent(event);
    expect(actual).toEqual({ type: "audience" });
  });

  it("should map a type and idPart event", () => {
    const event = { pathParameters: { type: "audience", idPart: "some-id" } };
    const actual = mapper.mapLambdaEvent(event);
    expect(actual).toEqual({ type: "audience", idPart: "some-id" });
  });

  it("should map a type and label event", () => {
    const event = {
      pathParameters: { type: "audience" },
      body: '{"label":"Some Label"}'
    };
    const actual = mapper.mapLambdaEvent(event);
    expect(actual).toEqual({ type: "audience", label: "Some Label" });
  });
});

describe("mapLambdaResponse", () => {
  it("should map", () => {
    const result = { acknowledged: true };
    const actual = mapper.mapLambdaResponse(result);

    expect(actual).toEqual({
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      },
      body: '{"acknowledged":true}'
    });
  });
});
