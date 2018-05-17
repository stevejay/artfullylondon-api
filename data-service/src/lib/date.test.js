"use strict";

const dateLib = require("./date");

describe("date", () => {
  describe("formatDate", () => {
    const tests = [
      {
        arg: 1491560202450,
        expected: "2017/04/07"
      }
    ];

    tests.map(test => {
      it(`should return ${test.expected} for arg ${test.arg}`, () => {
        const actual = dateLib.formatDate(new Date(test.arg));
        expect(actual).toEqual(test.expected);
      });
    });
  });
});
