"use strict";

const path = require("path");
const imageReader = require("./image-reader");

const sync = fn =>
  fn.then(res => () => res).catch(err => () => {
    throw err;
  });

describe("image-reader", () => {
  describe("getImageFeatures", () => {
    it("should throw an error when reading a non-image file", async () => {
      expect(
        await sync(
          imageReader.getImageFeatures(
            path.resolve(__dirname, "../../tests/images/not-an-image.json")
          )
        )
      ).toThrow();
    });

    it("should handle getting the image features of a jpg image", async () => {
      const result = await imageReader.getImageFeatures(
        path.resolve(__dirname, "../../tests/images/test.jpg")
      );

      expect(result).toEqual({
        mimeType: "image/jpeg",
        width: 1000,
        height: 667,
        dominantColor: "1e1511"
      });
    });

    it("should handle getting the image features of a webp image", async () => {
      const result = await imageReader.getImageFeatures(
        path.resolve(__dirname, ".../../tests/images/notflix.webp")
      );

      expect(result).toEqual({
        mimeType: "image/webp",
        width: 900,
        height: 573,
        dominantColor: "861915"
      });
    });

    it("should handle getting the image features of a png", async () => {
      const result = await imageReader.getImageFeatures(
        path.resolve(__dirname, "../../tests/images/red.png")
      );

      expect(result).toEqual({
        mimeType: "image/png",
        width: 2000,
        height: 1200,
        dominantColor: "dd0000"
      });
    });

    it("should handle getting the image features of a png with no extension", async () => {
      const result = await imageReader.getImageFeatures(
        path.resolve(__dirname, "../../tests/images/red")
      );

      expect(result).toEqual({
        mimeType: "image/png",
        width: 2000,
        height: 1200,
        dominantColor: "dd0000"
      });
    });
  });

  describe("getExtensionFromUrl", () => {
    const tests = [
      {
        it: "should get a png extension",
        arg: "http://test.com/dir/foo.png",
        expected: ".png"
      },
      {
        it:
          "should get a png extension when there is an intermediate extension",
        arg: "http://test.com/dir.jpg/foo.png",
        expected: ".png"
      },
      {
        it: "should handle an uppercase jpg extension",
        arg: "http://test.com/dir/foo.JPG",
        expected: ".jpg"
      },
      {
        it:
          "should default to returning a jpg extension if there is no extension",
        arg: "http://test.com/dir/foo",
        expected: ".jpg"
      },
      {
        it: "should ignore a querystring",
        arg: "http://test.com/dir/foo.png?bar=bat",
        expected: ".png"
      }
    ];

    tests.forEach(test => {
      it(test.it, () => {
        const actual = imageReader.getExtensionFromUrl(test.arg);
        expect(actual).toEqual(test.expected);
      });
    });
  });
});
