"use strict";

const path = require("path");
const file = require("./file");

const sync = fn =>
  fn.then(res => () => res).catch(err => () => {
    throw err;
  });

describe("file", () => {
  describe("downloadFile", () => {
    it("should download a file that exists", async () => {
      await file.downloadFile(
        "https://siteimages.artfully.london/artgallery.png",
        path.resolve(__dirname, "../../tests/images/image.result.png")
      );
    });

    it("should throw when downloading a file that does not exist", async () => {
      expect(
        await sync(
          file.downloadFile(
            "https://siteimages.artfully.london/sfhf8yfkal8xwe.png",
            path.resolve(__dirname, "../../tests/images/image.result.png")
          )
        )
      ).toThrow();
    });
  });
});
