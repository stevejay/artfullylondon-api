import * as mapper from "./___mapper";

describe("mapResponse", () => {
  it("should map an admin response", () => {
    const result = mapper.mapResponse({ foo: "bar" }, { admin: true });
    expect(result).toEqual({
      headers: { "Cache-Control": "no-cache" },
      body: '{"foo":"bar"}'
    });
  });

  it("should map a non-admin response", () => {
    const result = mapper.mapResponse({ foo: "bar" }, { admin: false });
    expect(result).toEqual({
      headers: { "Cache-Control": "public, max-age=1800" },
      body: '{"foo":"bar"}'
    });
  });
});
