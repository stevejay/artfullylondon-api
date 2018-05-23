"use strict";

const id = require("./id");

describe("id", () => {
  describe("createIdFromName", () => {
    describe("with no entropy", () => {
      const tests = [
        { arg: "Foo Bar", expected: "foo-bar" },
        { arg: "/Foo/Bar/", expected: "foo-bar" },
        { arg: "Foo/Bar", expected: "foo-bar" },
        { arg: "12345", expected: "12345" },
        { arg: "Tüni_c_ 77 //   brave", expected: "tueni_c_-77-brave" },
        { arg: "this |+ that", expected: "this-or-that" },
        { arg: "this + that", expected: "this-that" },
        { arg: "this, that", expected: "this-that" },
        { arg: "one/ Two,three/four", expected: "one-two-three-four" }
      ];

      tests.map(test => {
        it(`should return ${JSON.stringify(
          test.expected
        )} when passed ${JSON.stringify(test.arg)}`, () => {
          const result = id.createIdFromName(test.arg, false);
          expect(result).toEqual(test.expected);
        });
      });
    });

    describe("with required entropy", () => {
      const tests = [
        { arg: "farm", expected: "farm" },
        { arg: "T", expected: "t" }
      ];

      tests.map(test => {
        it(`should return ${JSON.stringify(
          test.expected
        )} when passed ${JSON.stringify(test.arg)}`, () => {
          const result = id.createIdFromName(test.arg, false);
          expect(result).toContain(test.expected);
          expect(result.length).toEqual(test.expected.length + 4);
        });
      });
    });

    describe("with forced entropy", () => {
      const tests = [{ arg: "long identifier", expected: "long-identifier" }];

      tests.map(test => {
        it(`should return ${JSON.stringify(
          test.expected
        )} when passed ${JSON.stringify(test.arg)}`, () => {
          const result = id.createIdFromName(test.arg, true);
          expect(result).toContain(test.expected);
          expect(result.length).toEqual(test.expected.length + 4);
        });
      });
    });
  });

  describe("createIdFromTalentData", () => {
    const tests = [
      {
        talent: {
          firstNames: "John Luther",
          lastName: "Arbril",
          commonRole: "Actor"
        },
        expected: "john-luther-arbril-actor"
      },
      {
        talent: {
          lastName: "Arbril",
          commonRole: "Actor"
        },
        expected: "arbril-actor"
      },
      {
        talent: {
          lastName: "Arb/ri,l",
          commonRole: "Actor"
        },
        expected: "arb-ri-l-actor"
      }
    ];

    tests.map(test => {
      it(`should return ${JSON.stringify(
        test.expected
      )} when passed ${JSON.stringify(test.talent)}`, () => {
        const result = id.createIdFromTalentData(test.talent);
        expect(result).toEqual(test.expected);
      });
    });
  });

  describe("createEventId", () => {
    const nowYear = `${new Date().getUTCFullYear()}`;

    const tests = [
      {
        args: ["foo", "2015/09/18", "Baritone"],
        expected: "foo/2015/baritone"
      },
      {
        args: ["foo", null, "Baritone"],
        expected: "foo/" + nowYear + "/baritone"
      }
    ];

    tests.map(test => {
      it(`should return ${JSON.stringify(
        test.expected
      )} when passed ${JSON.stringify(test.args)}`, () => {
        const result = id.createEventId.apply(null, test.args);
        expect(result).toEqual(test.expected);
      });
    });
  });

  describe("createExternalEventId", () => {
    const tests = [
      {
        it: "should handle http event url",
        args: {
          venueId: "almeida-theatre",
          eventUrl: "http://foo.com/bar/bat"
        },
        expected: "almeida-theatre|/bar/bat"
      },
      {
        it: "should handle https event url",
        args: {
          venueId: "almeida-theatre",
          eventUrl: "HTTPS://foo.com/bar/bat"
        },
        expected: "almeida-theatre|/bar/bat"
      },
      {
        it: "should handle url of only a hostname",
        args: {
          venueId: "almeida-theatre",
          eventUrl: "HTTPS://foo.com"
        },
        expected: "almeida-theatre|/"
      }
    ];

    tests.map(test => {
      it(test.it, () => {
        const result = id.createExternalEventId(
          test.args.venueId,
          test.args.eventUrl
        );

        expect(result).toEqual(test.expected);
      });
    });
  });

  describe("buildEventIdFromEventUrlParts", () => {
    const tests = [
      {
        args: {
          idLocation: "almeida-theatre",
          idYear: "2016",
          idName: "zaha-bril"
        },
        expected: "almeida-theatre/2016/zaha-bril"
      }
    ];

    tests.map(test => {
      it(`should return ${JSON.stringify(
        test.expected
      )} when passed ${JSON.stringify(test.args)}`, () => {
        const result = id.buildEventIdFromEventUrlParts(test.args);
        expect(result).toEqual(test.expected);
      });
    });
  });
});
