"use strict";

const expect = require("chai").expect;
const subject = require("../lib/date");

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
        const actual = subject.formatDate(new Date(test.arg));
        expect(actual).to.eql(test.expected);
      });
    });
  });
});
