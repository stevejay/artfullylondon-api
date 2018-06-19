"use strict";

const date = require("./date");

describe("getTodayAsStringDate", () => {
  it("should create a string date", () => {
    const result = date.getTodayAsStringDate();
    expect(result).toMatch(/^\d\d\d\d\/\d\d\/\d\d$/);
  });
});
