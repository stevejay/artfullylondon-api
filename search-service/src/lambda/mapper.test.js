import * as mapper from "./mapper";

describe("mapEventFullSearchEvent", () => {
  const tests = [
    {
      arg: {
        term: "foo"
      },
      expected: {
        term: "foo"
      }
    },
    {
      arg: {
        dateFrom: "2017-08-14",
        dateTo: "2017-08-15",
        timeFrom: "13:00",
        timeTo: "14:00",
        area: "Central",
        medium: "medium/painting",
        style: "style/surreal",
        audience: "audience/families",
        cost: "Free",
        booking: "Required",
        venueId: "1",
        talentId: "2",
        skip: 0,
        take: 10
      },
      expected: {
        dateFrom: "2017-08-14",
        dateTo: "2017-08-15",
        timeFrom: "13:00",
        timeTo: "14:00",
        area: "Central",
        medium: "medium/painting",
        style: "style/surreal",
        audience: "audience/families",
        cost: "Free",
        booking: "Required",
        venueId: "1",
        talentId: "2",
        skip: 0,
        take: 10
      }
    },
    {
      arg: {
        skip: 12,
        take: 0
      },
      expected: {
        skip: 12,
        take: 0
      }
    },
    {
      arg: {
        north: 1,
        south: 0,
        east: 3,
        west: 4
      },
      expected: {
        location: {
          north: 1,
          south: 0,
          east: 3,
          west: 4
        }
      }
    },
    {
      arg: {},
      expected: {}
    }
  ];

  tests.map(test => {
    it(`should return ${JSON.stringify(
      test.expected
    )} when passed ${JSON.stringify(test.arg)}`, () => {
      const result = mapper.mapEventFullSearchEvent({
        queryStringParameters: test.arg
      });
      expect(result).toEqual(test.expected);
    });
  });
});

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
