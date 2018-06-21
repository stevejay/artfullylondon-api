import * as idGenerator from "./id-generator";

describe("generateFromName", () => {
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
        const result = idGenerator.generateFromName(test.arg, false);
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
        const result = idGenerator.generateFromName(test.arg, false);
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
        const result = idGenerator.generateFromName(test.arg, true);
        expect(result).toContain(test.expected);
        expect(result.length).toEqual(test.expected.length + 4);
      });
    });
  });
});

describe("generateFromTalent", () => {
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
      const result = idGenerator.generateFromTalent(test.talent);
      expect(result).toEqual(test.expected);
    });
  });
});

describe("generateFromEvent", () => {
  const nowYear = `${new Date().getUTCFullYear()}`;

  const tests = [
    {
      arg: { venueId: "foo", dateFrom: "2015-09-18", name: "Baritone" },
      expected: "foo/2015/baritone"
    },
    {
      arg: { venue: { id: "foo" }, dateFrom: "2015-09-18", name: "Baritone" },
      expected: "foo/2015/baritone"
    },
    {
      arg: { venueId: "foo", dateFrom: null, name: "Baritone" },
      expected: "foo/" + nowYear + "/baritone"
    }
  ];

  tests.map(test => {
    it(`should return ${JSON.stringify(
      test.expected
    )} when passed ${JSON.stringify(test.arg)}`, () => {
      const result = idGenerator.generateFromEvent(test.arg);
      expect(result).toEqual(test.expected);
    });
  });
});
