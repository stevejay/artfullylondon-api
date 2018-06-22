import { sync } from "jest-toolkit";
import path from "path";
import * as fs from "fs";
import * as fileDownloader from "../../src/image-processing-service/file-downloader";
const OUTPUT_DIR = path.resolve(__dirname, "../output");

describe("file downloader", () => {
  describe("downloadToDisk", () => {
    it("should download a file that exists", async () => {
      const destFilePath = path.resolve(
        OUTPUT_DIR,
        "file-downloader-200.result.png"
      );
      await fileDownloader.downloadToDisk(
        "https://siteimages.artfully.london/artgallery.png",
        destFilePath
      );
      expect(fs.existsSync(destFilePath)).toEqual(true);
    });

    it("should throw when downloading a file that does not exist", async () => {
      expect(
        await sync(
          fileDownloader.downloadToDisk(
            "https://siteimages.artfully.london/sfhf8yfkal8xwe.png",
            path.resolve(OUTPUT_DIR, "file-downloader-404.result.png")
          )
        )
      ).toThrow(/404/);
    });
  });
});
