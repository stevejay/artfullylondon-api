import * as idGenerator from "./id-generator";

describe("createFromLabel", () => {
  test.each([
    ["geo", "Furious Five", "geo/furious-five"],
    ["medium", "theatre", "medium/theatre"]
  ])(".createFromLabel(%s, %s)", (prefix, label, expected) => {
    expect(idGenerator.createFromLabel(prefix, label)).toEqual(expected);
  });
});

describe("join", () => {
  it("should return valid id from id parts", () => {
    expect(idGenerator.join("medium", "theatre", "immersive")).toEqual(
      "medium/theatre/immersive"
    );
  });
});
