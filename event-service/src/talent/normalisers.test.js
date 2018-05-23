"use strict";

const normalise = require("normalise-request");
const normalisers = require("./normalisers");

describe("talent normalisers", () => {
  it("should apply talent normalisers to fully populated individual talent", () => {
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

    normalise(request, normalisers);

    expect(request).eql({
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

  it("should apply talent normalisers to minimally populated individual talent", () => {
    const request = {
      firstNames: "",
      lastName: "Stage",
      status: "Active",
      talentType: "Individual",
      commonRole: "Actor",
      version: 3
    };

    normalise(request, normalisers);

    expect(request).eql({
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
});
