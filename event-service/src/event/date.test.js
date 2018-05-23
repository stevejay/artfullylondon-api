"use strict";

const moment = require("moment");
const date = require("./date");

describe("date", () => {
  describe("getDayNumberFromMoment", () => {
    it("should get the day number", () => {
      const testDate = moment("2016/12/25", "YYYY/MM/DD");
      const actual = date.getDayNumberFromMoment(testDate);
      expect(actual).toEqual(6);
    });
  });

  describe("createStringDateFromMoment", () => {
    it("should create a string date", () => {
      const testDate = moment("2016/12/25", "YYYY/MM/DD");
      const actual = date.createStringDateFromMoment(testDate);
      expect(actual).toEqual("2016/12/25");
    });
  });

  describe("createMomentFromStringDate", () => {
    it("should create a moment", () => {
      const actual = date.createMomentFromStringDate("2016/12/25");
      expect(actual.year()).toEqual(2016);
      expect(actual.month()).toEqual(11);
      expect(actual.date()).toEqual(25);
    });
  });

  describe("createStringDateFromToday", () => {
    it("should create a date for today", () => {
      const actual = date.createStringDateFromToday(0);
      expect(actual).toMatch(/^\d\d\d\d\/\d\d\/\d\d$/);
    });

    it("should create a date for tomorrow", () => {
      const actual = date.createStringDateFromToday(1);
      expect(actual).toMatch(/^\d\d\d\d\/\d\d\/\d\d$/);
    });
  });
});
