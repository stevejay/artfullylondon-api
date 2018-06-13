import * as geoMappings from "./geo-mappings";

describe("mapLondonArea", () => {
  const tests = [
    { postcode: "W1S 1AA", expected: "Central" },
    { postcode: "W1 1AA", expected: "Central" },
    { postcode: "W12 1AA", expected: "West" },
    { postcode: "N4 1AA", expected: "North" },
    { postcode: "E17 1AA", expected: "East" },
    { postcode: "SE6 1AA", expected: "SouthEast" },
    { postcode: "SW12 1AA", expected: "SouthWest" },
    { postcode: "UB1 1AA", expected: "West" },
    { postcode: "NW2 1AA", expected: "North" },
    { postcode: "EC2N 1AA", expected: "Central" }
  ];

  tests.map(test => {
    it(`should return ${test.expected} for postcode ${test.postcode}`, () => {
      const actual = geoMappings.mapLondonArea({
        venue: { postcode: test.postcode }
      });
      expect(actual).toEqual(test.expected);
    });
  });

  it("should throw if the postcode was not matched", () => {
    expect(() =>
      geoMappings.mapLondonArea({ venue: { postcode: "foo bar" } })
    ).toThrow();
  });
});
