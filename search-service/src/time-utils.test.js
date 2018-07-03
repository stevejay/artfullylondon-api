import * as timeUtils from "./time-utils";

describe("getUtcNow", () => {
  it("should return a date", () => {
    expect(timeUtils.getUtcNow()).toBeInstanceOf(Date);
  });
});

describe("formatAsIsoShortDateString", () => {
  it("should format a date", () => {
    expect(
      timeUtils.formatAsIsoShortDateString(new Date("1995-12-17T03:24:00"))
    ).toEqual("1995-12-17");
  });
});
