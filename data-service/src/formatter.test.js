import * as formatter from "./formatter";

describe("formatter", () => {
  describe("formatDate", () => {
    const tests = [
      {
        arg: 1491560202450,
        expected: "2017/04/07"
      }
    ];

    tests.map(test => {
      it(`should return ${test.expected} for arg ${test.arg}`, () => {
        const actual = formatter.formatDate(new Date(test.arg));
        expect(actual).toEqual(test.expected);
      });
    });
  });
});
