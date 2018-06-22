import path from "path";
import * as fs from "fs";
import * as imageResizingPipeline from "../../src/image-processing-service/image-resizing-pipeline";
import * as s3Utils from "../utils/s3";

const TEST_IMAGES_DIR = path.resolve(__dirname, "../images");
const OUTPUT_DIR = path.resolve(__dirname, "../output");
const RESIZED_BUCKET_NAME = "imageresizingpipeline-resizedbucket";

process.env.SERVERLESS_RESIZED_IMAGES_BUCKET_NAME = RESIZED_BUCKET_NAME;

describe("image resizing pipeline", () => {
  beforeAll(async () => {
    await s3Utils.createBucket(RESIZED_BUCKET_NAME);
  });

  afterAll(async () => {
    await s3Utils.deleteBucket(RESIZED_BUCKET_NAME);
  });

  it("should handle the resizing of an image", async () => {
    const destFilePath = path.resolve(
      OUTPUT_DIR,
      "image-resizing-pipeline.result.jpg"
    );
    await imageResizingPipeline.run(
      { width: 120, height: 120, suffix: "120x120" },
      "12345678",
      path.resolve(TEST_IMAGES_DIR, "test.jpg")
    );
    await s3Utils.downloadFileFromS3(
      RESIZED_BUCKET_NAME,
      "12/34/12345678/120x120.jpg",
      destFilePath
    );
    expect(fs.existsSync(destFilePath)).toEqual(true);
  });
});
