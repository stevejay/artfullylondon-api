import * as idGenerator from "./id-generator";
import * as entityType from "../types/entity-type";

describe("generateFromName", () => {
  test.each([
    ["Foo Bar", entityType.TALENT, "talent/foo-bar"],
    ["/Foo/Bar/", entityType.EVENT_SERIES, "event-series/foo-bar"],
    ["Foo/Bar", entityType.VENUE, "venue/foo-bar"],
    ["12345", entityType.EVENT, "event/12345"],
    ["Tüni_c_ 77 //   brave", entityType.TALENT, "talent/tueni_c_-77-brave"],
    ["this |+ that", entityType.TALENT, "talent/this-or-that"],
    ["this + that", entityType.TALENT, "talent/this-that"],
    ["this, that", entityType.TALENT, "talent/this-that"],
    ["one/ Two,three/four", entityType.TALENT, "talent/one-two-three-four"]
  ])("%s for entity %s should create id %s", (name, entityType, expected) => {
    const result = idGenerator.generateFromName(name, entityType);
    expect(result).toEqual(expected);
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
      expected: "talent/john-luther-arbril-actor"
    },
    {
      talent: {
        lastName: "Arbril",
        commonRole: "Actor"
      },
      expected: "talent/arbril-actor"
    },
    {
      talent: {
        lastName: "Arb/ri,l",
        commonRole: "Actor"
      },
      expected: "talent/arb-ri-l-actor"
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
      arg: { venueId: "venue/foo", dateFrom: "2015-09-18", name: "Baritone" },
      expected: "event/foo/2015/baritone"
    },
    {
      arg: {
        venue: { id: "venue/foo" },
        dateFrom: "2015-09-18",
        name: "Baritone"
      },
      expected: "event/foo/2015/baritone"
    },
    {
      arg: { venueId: "venue/foo", dateFrom: null, name: "Baritone" },
      expected: "event/foo/" + nowYear + "/baritone"
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
