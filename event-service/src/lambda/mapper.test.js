import * as mapper from "./mapper";

describe("mapGetEntityMultiRequest", () => {
  test.each([
    [{}, { ids: [] }],
    [{ ids: ["1", "2"] }, { ids: ["1", "2"] }],
    [{ ids: "1,2" }, { ids: ["1", "2"] }]
  ])("should map %o to %o", (params, expected) => {
    const result = mapper.mapGetEntityMultiRequest(params);
    expect(result).toEqual(expected);
  });
});
