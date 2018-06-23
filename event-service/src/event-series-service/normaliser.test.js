import * as normaliser from "./normaliser";

describe("event series normaliser", () => {
  it("should apply event normalisers to fully populated params", () => {
    const params = {
      name: "  Taming of the Shrew   ",
      status: "Active",
      eventSeriesType: "Season",
      occurrence: "  Some time of year   ",
      summary: "   A contemporary update of this Shakespeare classic   ",
      description: "  A contemporary update.  ",
      descriptionCredit: "   Some credit   ",
      links: [{ type: "Wikipedia", url: "   https://en.wikipedia.org/foo  " }],
      images: [
        {
          id: "abcd1234abcd1234abcd1234abcd1234",
          ratio: 1.2,
          copyright: " Foo  "
        }
      ],
      weSay: "   something   ",
      version: 1
    };

    const result = normaliser.normaliseCreateOrUpdateEventSeriesRequest(params);

    expect(result).toEqual({
      name: "Taming of the Shrew",
      status: "Active",
      eventSeriesType: "Season",
      occurrence: "Some time of year",
      summary: "A contemporary update of this Shakespeare classic",
      description: "A contemporary update.",
      descriptionCredit: "Some credit",
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
      version: 1
    });
  });

  it("should apply event normalisers to minimal params", () => {
    const params = {
      name: "  Taming of the Shrew   ",
      status: "Active",
      eventSeriesType: "Season",
      occurrence: "  Some time of year   ",
      summary: "   A contemporary update of this Shakespeare classic   ",
      description: "  A contemporary update.  ",
      descriptionCredit: "   ",
      links: [],
      images: [],
      weSay: "   ",
      version: 1
    };

    const result = normaliser.normaliseCreateOrUpdateEventSeriesRequest(params);

    expect(result).toEqual({
      name: "Taming of the Shrew",
      status: "Active",
      eventSeriesType: "Season",
      occurrence: "Some time of year",
      summary: "A contemporary update of this Shakespeare classic",
      description: "A contemporary update.",
      descriptionCredit: undefined,
      links: undefined,
      images: undefined,
      weSay: undefined,
      version: 1
    });
  });
});
