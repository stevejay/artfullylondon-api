import * as normaliser from "./normaliser";

it("should normalise a fully populated individual talent", () => {
  const request = {
    firstNames: " Anne  ",
    lastName: "   Trixy Stage",
    status: "Active",
    talentType: "Individual",
    commonRole: "Actor   ",
    description: "  An actor.  ",
    descriptionCredit: " Credit  ",
    links: [{ type: "Wikipedia", url: "   https://en.wikipedia.org/foo  " }],
    images: [
      {
        id: "abcd1234abcd1234abcd1234abcd1234",
        ratio: 1.2,
        copyright: " Foo  "
      }
    ],
    weSay: "   something   ",
    version: 3
  };

  const result = normaliser.normaliseCreateTalentRequest(request);

  expect(result).toEqual({
    firstNames: "Anne",
    lastName: "Trixy Stage",
    status: "Active",
    talentType: "Individual",
    commonRole: "Actor",
    description: "An actor.",
    descriptionCredit: "Credit",
    links: [{ type: "Wikipedia", url: "https://en.wikipedia.org/foo" }],
    images: [
      {
        id: "abcd1234abcd1234abcd1234abcd1234",
        ratio: 1.2,
        copyright: "Foo",
        dominantColor: undefined
      }
    ],
    weSay: "something",
    version: 3
  });
});

it("should normalise a minimally populated individual talent", () => {
  const request = {
    firstNames: "",
    lastName: "Stage",
    status: "Active",
    talentType: "Individual",
    commonRole: "Actor",
    version: 3
  };

  const result = normaliser.normaliseCreateTalentRequest(request);

  expect(result).toEqual({
    firstNames: undefined,
    lastName: "Stage",
    status: "Active",
    talentType: "Individual",
    commonRole: "Actor",
    description: undefined,
    descriptionCredit: undefined,
    links: undefined,
    images: undefined,
    weSay: undefined,
    version: 3
  });
});
