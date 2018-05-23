"use strict";

const constraints = require("./constraints");
const globalConstants = require("../constants");

describe("global constraints", () => {
  describe("LINK_URL_DEPENDENCY_ON_LINK_TYPE", () => {
    const tests = [
      {
        args: {
          attrs: { type: globalConstants.LINK_TYPE_WIKIPEDIA },
          value: "https://en.wikipedia.org/wiki/Almeida_Theatre"
        },
        expected: true
      },
      {
        args: {
          attrs: { type: globalConstants.LINK_TYPE_WIKIPEDIA },
          value: "https://wikipedia.com"
        },
        expected: false
      },
      {
        args: {
          attrs: { type: globalConstants.LINK_TYPE_WIKIPEDIA },
          value: "https://en.wikipedia.org/wiki/Almeida_Theatre?foo"
        },
        expected: false
      },
      {
        args: {
          attrs: { type: globalConstants.LINK_TYPE_FACEBOOK },
          value: "https://www.facebook.com/almeidatheatre/"
        },
        expected: true
      },
      {
        args: {
          attrs: { type: globalConstants.LINK_TYPE_FACEBOOK },
          value: "http://www.facebook.com/almeidatheatre/"
        },
        expected: false
      },
      {
        args: {
          attrs: { type: globalConstants.LINK_TYPE_FACEBOOK },
          value: "https://www.facebook.com/almeidatheatre/?nope"
        },
        expected: false
      },
      {
        args: {
          attrs: { type: globalConstants.LINK_TYPE_TWITTER },
          value: "https://twitter.com/AlmeidaTheatre"
        },
        expected: true
      },
      {
        args: {
          attrs: { type: globalConstants.LINK_TYPE_TWITTER },
          value: "https://www.twitter.com/AlmeidaTheatre"
        },
        expected: false
      },
      {
        args: {
          attrs: { type: globalConstants.LINK_TYPE_TWITTER },
          value: "https://twitter.com/AlmeidaTheatre?no"
        },
        expected: false
      },
      {
        args: {
          attrs: { type: globalConstants.LINK_TYPE_HOMEPAGE },
          value: "http://www.test.com/?hello"
        },
        expected: true
      },
      {
        args: {
          attrs: { type: globalConstants.LINK_TYPE_ACCESS },
          value: "http://www.test.com/?hello"
        },
        expected: true
      },
      {
        args: {
          attrs: { type: globalConstants.LINK_TYPE_BOOKING },
          value: "http://www.test.com/?hello"
        },
        expected: true
      },
      {
        args: {
          attrs: { type: globalConstants.LINK_TYPE_INSTAGRAM },
          value: "https://www.instagram.com/hauserwirth/"
        },
        expected: true
      },
      {
        args: {
          attrs: { type: globalConstants.LINK_TYPE_INSTAGRAM },
          value: "https://instagram.com/hauserwirth/"
        },
        expected: false
      },
      {
        args: {
          attrs: { type: globalConstants.LINK_TYPE_INSTAGRAM },
          value: "https://www.instagram.com/hauserwirth/?hl=en"
        },
        expected: false
      }
    ];

    tests.map(test => {
      it(`should return ${JSON.stringify(
        test.expected
      )} when passed ${JSON.stringify(test.args)}`, () => {
        const result = constraints.LINK_URL_DEPENDENCY_ON_LINK_TYPE.ensure(
          test.args.value,
          test.args.attrs
        );

        expect(result).toEqual(test.expected);
      });
    });
  });
});
