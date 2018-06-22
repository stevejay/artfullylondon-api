import { sync } from "jest-toolkit";
import path from "path";
import * as imageReader from "../../src/image-processing-service/image-reader";

const TEST_IMAGES_DIR = path.resolve(__dirname, "../images");

describe("getImageMetadata", () => {
  it("should throw an error when reading a non-image file", async () => {
    expect(
      await sync(
        imageReader.getImageMetadata(
          path.resolve(TEST_IMAGES_DIR, "not-an-image.json")
        )
      )
    ).toThrow();
  });

  it("should handle getting the image features of a jpg image", async () => {
    const result = await imageReader.getImageMetadata(
      path.resolve(TEST_IMAGES_DIR, "test.jpg")
    );

    expect(result).toEqual({
      mimeType: "image/jpeg",
      width: 1000,
      height: 667,
      dominantColor: "1e1511"
    });
  });

  it("should handle getting the image features of a webp image", async () => {
    const result = await imageReader.getImageMetadata(
      path.resolve(TEST_IMAGES_DIR, "notflix.webp")
    );

    expect(result).toEqual({
      mimeType: "image/webp",
      width: 900,
      height: 573,
      dominantColor: "861915"
    });
  });

  it("should handle getting the image features of a png", async () => {
    const result = await imageReader.getImageMetadata(
      path.resolve(TEST_IMAGES_DIR, "red.png")
    );

    expect(result).toEqual({
      mimeType: "image/png",
      width: 2000,
      height: 1200,
      dominantColor: "dd0000"
    });
  });

  it("should handle getting the image features of a png with no extension", async () => {
    const result = await imageReader.getImageMetadata(
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
