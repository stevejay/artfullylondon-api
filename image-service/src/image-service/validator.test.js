import * as validator from "./validator";
import * as imageType from "../image-type";

describe("validateAddImageRequest", () => {
  it("should allow a valid request", () => {
    const request = {
      type: imageType.VENUE,
      id: "12345678123456781234567812345678",
      url: "http://foo.com/"
    };
    expect(() => validator.validateAddImageRequest(request)).not.toThrow();
  });

  test.each([
    [
      {
        type: "foo",
        id: "12345678123456781234567812345678",
        url: "http://foo.com/"
      }
    ],
    [
      {
        type: imageType.VENUE,
        id: "1234",
        url: "http://foo.com/"
      }
    ],
    [
      {
        type: imageType.VENUE,
        id: "12345678123456781234567812345678",
        url: "foo"
      }
    ]
  ])("should throw when validating %o", request => {
    expect(() => validator.validateAddImageRequest(request)).toThrow(
      /Bad Request/
    );
  });
});
