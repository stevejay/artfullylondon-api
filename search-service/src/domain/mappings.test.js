"use strict";

const mappings = require("./mappings");

describe("mappings", function() {
  describe("mapSearchResultHitsToItems", function() {
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
      )} when passed ${JSON.stringify(test.arg)}`, function() {
        const result = mappings.mapSearchResultHitsToItems(test.arg);
        expect(result).toEqual(test.expected);
      });
    });
  });

  describe("mapAutocompleteSearchHandlerDataToRequest", function() {
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
      )} when passed ${JSON.stringify(test.arg)}`, function() {
        const result = mappings.mapAutocompleteSearchHandlerDataToRequest({
          queryStringParameters: test.arg
        });
        expect(result).toEqual(test.expected);
      });
    });
  });

  describe("mapEventFullSearchHandlerDataToRequest", function() {
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
      )} when passed ${JSON.stringify(test.arg)}`, function() {
        const result = mappings.mapEventFullSearchHandlerDataToRequest({
          queryStringParameters: test.arg
        });
        expect(result).toEqual(test.expected);
      });
    });
  });

  describe("mapBasicSearchHandlerDataToRequest", function() {
    const tests = [
      {
        arg: {
          term: "foo",
          north: 1,
          south: 0,
          east: 3,
          west: 4
        },
        expected: {
          term: "foo",
          location: {
            north: 1,
            south: 0,
            east: 3,
            west: 4
          },
          entityType: undefined,
          skip: undefined,
          take: undefined
        }
      },
      {
        arg: {
          term: "foo",
          north: 1,
          south: 2,
          east: 3
        },
        expected: {
          term: "foo",
          entityType: undefined,
          skip: undefined,
          take: undefined,
          location: undefined
        }
      },
      {
        arg: {
          term: "foo",
          north: 1,
          south: 2,
          west: 4
        },
        expected: {
          term: "foo",
          entityType: undefined,
          skip: undefined,
          take: undefined,
          location: undefined
        }
      },
      {
        arg: {
          term: "foo",
          north: 1,
          east: 3,
          west: 4
        },
        expected: {
          term: "foo",
          entityType: undefined,
          skip: undefined,
          take: undefined,
          location: undefined
        }
      },
      {
        arg: {
          term: "foo",
          south: 2,
          east: 3,
          west: 4
        },
        expected: {
          term: "foo",
          entityType: undefined,
          skip: undefined,
          take: undefined,
          location: undefined
        }
      },
      {
        arg: {
          entityType: "event",
          skip: 20,
          take: 10
        },
        expected: {
          entityType: "event",
          skip: 20,
          take: 10,
          location: undefined,
          term: undefined
        }
      }
    ];

    tests.map(test => {
      it(`should return ${JSON.stringify(
        test.expected
      )} when passed ${JSON.stringify(test.arg)}`, function() {
        const result = mappings.mapBasicSearchHandlerDataToRequest({
          queryStringParameters: test.arg
        });

        expect(result).toEqual(test.expected);
      });
    });
  });

  describe("flattenSearchResults", function() {
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
      )} when passed ${JSON.stringify(test.args)}`, function() {
        const result = mappings.flattenSearchResults.apply(null, test.args);
        expect(result).toEqual(test.expected);
      });
    });
  });

  describe("getTakeFromSearchResults", function() {
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
      )} when passed ${JSON.stringify(test.args)}`, function() {
        const result = mappings.getTakeFromSearchResults(
          test.args.take,
          test.args.sources
        );
        expect(result).toEqual(test.expected);
      });
    });
  });

  describe("mapAutocompleteSearchResults", function() {
    it("should map responses where there are no duplicates", function() {
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

      const result = mappings.mapAutocompleteSearchResults(responses, [
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

    it("should map responses where there are duplicates", function() {
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

      const result = mappings.mapAutocompleteSearchResults(responses, [
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
});
