import * as geoMappings from "./geo-mappings";
import * as areaType from "../../types/area-type";

describe("mapLondonArea", () => {
  const tests = [
    { postcode: "W1S 1AA", expected: areaType.CENTRAL },
    { postcode: "W1 1AA", expected: areaType.CENTRAL },
    { postcode: "W12 1AA", expected: areaType.WEST },
    { postcode: "N4 1AA", expected: areaType.NORTH },
    { postcode: "E17 1AA", expected: areaType.EAST },
    { postcode: "SE6 1AA", expected: areaType.SOUTH_EAST },
    { postcode: "SW12 1AA", expected: areaType.SOUTH_WEST },
    { postcode: "UB1 1AA", expected: areaType.WEST },
    { postcode: "NW2 1AA", expected: areaType.NORTH },
    { postcode: "EC2N 1AA", expected: areaType.CENTRAL }
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
