import normalise from "./normalise";

describe("sanitizeHtml", () => {
  test.each([
    ["", ""],
    [null, null],
    [undefined, undefined],
    ["Some text", "Some text"],
    ["<p>Bar</p>", "<p>Bar</p>"],
    ["<script>alert('hello world')</script>", ""],
    ["<p>Bar<script>alert('hello world')</script></p>", "<p>Bar</p>"]
  ])("%s should sanitize to %s", (input, expected) => {
    const result = normalise({ foo: input }, { foo: { sanitizeHtml: true } });
    expect(result).toEqual({ foo: expected });
  });
});
