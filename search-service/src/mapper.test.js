import * as mapper from "./mapper";

describe("mapSearchResultHitsToItems", () => {
  const tests = [
    {
      arg: {
        hits: {
          total: 33,
          hits: [{ _source: { id: "1" } }]
        }
      },
      expected: {
        total: 33,
        items: [{ id: "1" }]
      }
    },
    {
      arg: {
        hits: {
          total: 2,
          hits: []
        }
      },
      expected: {
        total: 2,
        items: []
      }
    }
  ];

  tests.map(test => {
    it(`should return ${JSON.stringify(
      test.expected
    )} when passed ${JSON.stringify(test.arg)}`, () => {
      const result = mapper.mapSearchResultHitsToItems(test.arg);
      expect(result).toEqual(test.expected);
    });
  });
});

describe("flattenSearchResults", () => {
  const tests = [
    {
      args: [[], []],
      expected: []
    },
    {
      args: [[{ id: 1 }, { id: 2 }, { id: 3 }], [{ id: 4 }, { id: 2 }]],
      expected: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
    }
  ];

  tests.map(test => {
    it(`should return ${JSON.stringify(
      test.expected
    )} when passed ${JSON.stringify(test.args)}`, () => {
      const result = mapper.flattenSearchResults.apply(null, test.args);
      expect(result).toEqual(test.expected);
    });
  });
});

describe("getTakeFromSearchResults", () => {
  const tests = [
    {
      args: {
        take: 10,
        sources: [
          {
            entityType: "event",
            total: 0,
            skip: 10,
            take: 20,
            items: []
          },
          {
            entityType: "venue",
            total: 30,
            skip: 40,
            take: 50,
            items: []
          }
        ]
      },
      expected: []
    },
    {
      args: {
        take: 3,
        sources: [
          {
            entityType: "event",
            total: 0,
            skip: 10,
            take: 20,
            items: [{ id: "e1" }, { id: "e2" }, { id: "e3" }]
          },
          {
            entityType: "venue",
            total: 30,
            skip: 40,
            take: 50,
            items: [{ id: "v1" }, { id: "v2" }, { id: "v3" }]
          }
        ]
      },
      expected: [{ id: "e1" }, { id: "v1" }, { id: "e2" }]
    },
    {
      args: {
        take: 4,
        sources: [
          {
            entityType: "event",
            total: 0,
            skip: 10,
            take: 20,
            items: [{ id: "e1" }, { id: "e2" }, { id: "e3" }]
          },
          {
            entityType: "venue",
            total: 30,
            skip: 40,
            take: 50,
            items: [{ id: "v1" }, { id: "v2" }, { id: "v3" }]
          }
        ]
      },
      expected: [{ id: "e1" }, { id: "v1" }, { id: "e2" }, { id: "v2" }]
    }
  ];

  tests.map(test => {
    it(`should return ${JSON.stringify(
      test.expected
    )} when passed ${JSON.stringify(test.args)}`, () => {
      const result = mapper.getTakeFromSearchResults(
        test.args.take,
        test.args.sources
      );
      expect(result).toEqual(test.expected);
    });
  });
});

describe("mapAutocompleteSearchResults", () => {
  it("should map responses where there are no duplicates", () => {
    const responses = {
      responses: [
        {
          // venue-auto index
          suggest: {
            autocomplete: [
              {
                options: [
                  {
                    text: "Venue 1",
                    _source: {
                      id: "venue-1"
                    }
                  }
                ]
              }
            ],
            fuzzyAutocomplete: [
              {
                options: [
                  {
                    text: "Venue 2",
                    _source: {
                      id: "venue-2"
                    }
                  }
                ]
              }
            ]
          }
        },
        {
          // talent-auto index
          suggest: {
            autocomplete: [
              {
                options: [
                  {
                    text: "Talent 1",
                    _source: {
                      id: "talent-1"
                    }
                  }
                ]
              }
            ],
            fuzzyAutocomplete: [
              {
                options: [
                  {
                    text: "Talent 2",
                    _source: {
                      id: "talent-2"
                    }
                  }
                ]
              }
            ]
          }
        }
      ]
    };

    const result = mapper.mapAutocompleteSearchResults(responses, [
      "venue-auto",
      "talent-auto"
    ]);

    expect(result).toEqual([
      {
        entityType: "venue",
        items: [
          { name: "Venue 1", id: "venue-1" },
          { name: "Venue 2", id: "venue-2" }
        ]
      },
      {
        entityType: "talent",
        items: [
          { name: "Talent 1", id: "talent-1" },
          { name: "Talent 2", id: "talent-2" }
        ]
      }
    ]);
  });

  it("should map responses where there are duplicates", () => {
    const responses = {
      responses: [
        {
          // venue-auto index
          suggest: {
            autocomplete: [
              {
                options: [
                  {
                    text: "Venue 1",
                    _source: {
                      id: "venue-1"
                    }
                  }
                ]
              }
            ],
            fuzzyAutocomplete: [
              {
                options: [
                  {
                    text: "Venue 1",
                    _source: {
                      id: "venue-1"
                    }
                  }
                ]
              }
            ]
          }
        },
        {
          // talent-auto index
          suggest: {
            autocomplete: [
              {
                options: [
                  {
                    text: "Talent 1",
                    _source: {
                      id: "talent-1"
                    }
                  }
                ]
              }
            ],
            fuzzyAutocomplete: [
              {
                options: [
                  {
                    text: "Talent 1",
                    _source: {
                      id: "talent-1"
                    }
                  }
                ]
              }
            ]
          }
        }
      ]
    };

    const result = mapper.mapAutocompleteSearchResults(responses, [
      "venue-auto",
      "talent-auto"
    ]);

    expect(result).toEqual([
      {
        entityType: "venue",
        items: [{ name: "Venue 1", id: "venue-1" }]
      },
      {
        entityType: "talent",
        items: [{ name: "Talent 1", id: "talent-1" }]
      }
    ]);
  });
});
