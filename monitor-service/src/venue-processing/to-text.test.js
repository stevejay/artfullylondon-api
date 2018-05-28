"use strict";

const toText = require("./to-text");

describe("to-text", function() {
  const tests = [
    {
      it: "should handle single html",
      arg: "<p>Foo</p>",
      expected: "Foo"
    },
    {
      it: "should handle array of html",
      arg: ["<p>Foo</p>", "<p>Bar</p>"],
      expected: "Foo\n\nBar"
    },
    {
      it: "should collapse newlines",
      arg: "<p>Foo<br/><br/><br/><br/><br/>Bar</p>",
      expected: "Foo\n\nBar"
    },
    {
      it: "should collapse newlines",
      arg: "<p>Foo<br/><br/><br/>   <br/>   <br/>Bar</p>",
      expected: "Foo\n\nBar"
    },
    {
      it: "should trim trailing newlines",
      arg: "<p>Foo\n\n</p>",
      expected: "Foo"
    }
  ];

  tests.forEach(test => {
    it(test.it, () => {
      const actual = toText(test.arg);
      expect(actual).toEqual(test.expected);
    });
  });
});
