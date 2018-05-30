"use strict";

const path = require("path");
const imageResizer = require("./image-resizer");

describe("image-resizer", () => {
  describe("resize", () => {
    it("should resize the cracknell jpg image", async () => {
      await imageResizer.resize(
        path.resolve(__dirname, "../../tests/images/test.jpg"),
        path.resolve(__dirname, "../../tests/images/test.result.jpg"),
        500,
        500
      );
    });

    it("should resize the red png image", async () => {
      await imageResizer.resize(
        path.resolve(__dirname, "../../tests/images/red.png"),
        path.resolve(__dirname, "../../tests/images/test.result.jpg"),
        500,
        500
      );
    });

    it("should resize the notflix webp image", async () => {
      await imageResizer.resize(
        path.resolve(__dirname, "../../tests/images/notflix.webp"),
        path.resolve(__dirname, "../../tests/images/test.result.jpg"),
        500,
        500
      );
    });
  });
});
