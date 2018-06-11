import * as mapper from "./mapper";

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
