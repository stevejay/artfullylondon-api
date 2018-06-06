import * as mapper from "./mapper";

describe("mapAutocompleteSearchEvent", () => {
  const tests = [
    {
      arg: {
        term: "foo",
        entityType: "venue"
      },
      expected: {
        term: "foo",
        entityType: "venue"
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
      const result = mapper.mapAutocompleteSearchEvent({
        queryStringParameters: test.arg
      });
      expect(result).toEqual(test.expected);
    });
  });
});

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
        dateFrom: "2017/08/14",
        dateTo: "2017/08/15",
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
        dateFrom: "2017/08/14",
        dateTo: "2017/08/15",
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

describe("mapBasicSearchEvent", () => {
  const tests = [
    {
      queryStringParameters: {
        term: "foo",
        north: 1,
        south: 0,
        east: 3,
        west: 4
      },
      resource: "/admin/foo",
      expected: {
        term: "foo",
        location: {
          north: 1,
          south: 0,
          east: 3,
          west: 4
        },
        isPublic: false
      }
    },
    {
      queryStringParameters: {
        entityType: "event",
        skip: 20,
        take: 10
      },
      resource: "/admin/foo",
      expected: {
        entityType: "event",
        skip: 20,
        take: 10,
        isPublic: false
      }
    },
    {
      queryStringParameters: {
        entityType: "event",
        skip: 20,
        take: 10
      },
      resource: "/public/foo",
      expected: {
        entityType: "event",
        skip: 20,
        take: 10,
        isPublic: true
      }
    }
  ];

  tests.map(test => {
    it(`should return ${JSON.stringify(
      test.expected
    )} when passed ${JSON.stringify(
      test.queryStringParameters
    )} and ${JSON.stringify(test.resource)}`, () => {
      const result = mapper.mapBasicSearchEvent({
        queryStringParameters: test.queryStringParameters,
        resource: test.resource
      });

      expect(result).toEqual(test.expected);
    });
  });
});

describe("mapPresetSearchEvent", () => {
  it("should map a valid event", () => {
    const event = {
      pathParameters: { name: "Some name" },
      queryStringParameters: { id: "some-id" }
    };

    const result = mapper.mapPresetSearchEvent(event);
    expect(result).toEqual({ name: "Some name", id: "some-id" });
  });

  it("should map an empty event", () => {
    const event = {
      pathParameters: {},
      queryStringParameters: {}
    };

    const result = mapper.mapPresetSearchEvent(event);
    expect(result).toEqual({});
  });
});

describe("mapRouteType", () => {
  const tests = [
    {
      resource: "/admin/foo",
      expected: { isPublic: false }
    },
    {
      resource: "/public/foo",
      expected: { isPublic: true }
    }
  ];

  tests.map(test => {
    it(`should return ${JSON.stringify(
      test.expected
    )} when passed ${JSON.stringify(test.resource)}`, () => {
      const result = mapper.mapBasicSearchEvent({
        resource: test.resource
      });

      expect(result).toEqual(test.expected);
    });
  });
});

describe("mapResponse", () => {
  it("should map a response", () => {
    const result = mapper.mapResponse({ foo: "bar" });
    expect(result).toEqual({
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      },
      body: '{"foo":"bar"}'
    });
  });
});
