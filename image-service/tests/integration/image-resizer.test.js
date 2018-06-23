import path from "path";
import * as fs from "fs";
import * as imageResizer from "../../src/image-processing-service/image-resizer";
jest.setTimeout(60000);

const TEST_IMAGES_DIR = path.resolve(__dirname, "../images");
const OUTPUT_DIR = path.resolve(__dirname, "../output");

describe("resize", () => {
  it("should resize the cracknell jpg image", async () => {
    const destFilePath = path.resolve(
      OUTPUT_DIR,
      "image-resizer-jpg.result.jpg"
    );
    await imageResizer.resize(
      path.resolve(TEST_IMAGES_DIR, "test.jpg"),
      destFilePath,
      500,
      500
    );
    expect(fs.existsSync(destFilePath)).toEqual(true);
  });

  it("should resize the red png image", async () => {
    const destFilePath = path.resolve(
      OUTPUT_DIR,
      "image-resizer-png.result.jpg"
    );
    await imageResizer.resize(
      path.resolve(TEST_IMAGES_DIR, "red.png"),
      destFilePath,
      500,
      500
    );
    expect(fs.existsSync(destFilePath)).toEqual(true);
  });

  it("should resize the notflix webp image", async () => {
    const destFilePath = path.resolve(
      OUTPUT_DIR,
      "image-resizer-webp.result.jpg"
    );
    await imageResizer.resize(
      path.resolve(TEST_IMAGES_DIR, "notflix.webp"),
      destFilePath,
      500,
      500
    );
    expect(fs.existsSync(destFilePath)).toEqual(true);
  });
});
