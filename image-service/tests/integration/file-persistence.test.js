import path from "path";
import * as fs from "fs";
import * as filePersistence from "../../src/file-persistence";
import * as s3Utils from "../utils/s3";
jest.setTimeout(60000);

const TEST_IMAGES_DIR = path.resolve(__dirname, "../images");
const OUTPUT_DIR = path.resolve(__dirname, "../output");
const ORIGINAL_BUCKET_NAME = "filepersistence-originalbucket";
const RESIZED_BUCKET_NAME = "filepersistence-resizedbucket";

process.env.SERVERLESS_ORIGINAL_IMAGES_BUCKET_NAME = ORIGINAL_BUCKET_NAME;
process.env.SERVERLESS_RESIZED_IMAGES_BUCKET_NAME = RESIZED_BUCKET_NAME;

describe("file persistence", () => {
  beforeAll(async () => {
    await s3Utils.createBucket(ORIGINAL_BUCKET_NAME);
    await s3Utils.createBucket(RESIZED_BUCKET_NAME);
  });

  afterAll(async () => {
    await s3Utils.deleteBucket(ORIGINAL_BUCKET_NAME);
    await s3Utils.deleteBucket(RESIZED_BUCKET_NAME);
  });

  it("should handle an original image", async () => {
    const content = fs.readFileSync(path.resolve(TEST_IMAGES_DIR, "red.png"));

    await filePersistence.uploadOriginalImage(
      "12345678",
      "http://test.com/foo.png",
      "image/png",
      content
    );

    const destFilePath = path.resolve(
      OUTPUT_DIR,
      "file-persistence-original.result.png"
    );

    await filePersistence.downloadOriginalImage(
      "12345678",
      "http://test.com/foo.png",
      destFilePath
    );

    expect(fs.existsSync(destFilePath)).toEqual(true);
  });

  it("should handle a resized image", async () => {
    const content = fs.readFileSync(path.resolve(TEST_IMAGES_DIR, "test.jpg"));

    await filePersistence.uploadResizedJpegImage(
      "12345678",
      "300x300",
      content
    );

    const destFilePath = path.resolve(
      OUTPUT_DIR,
      "file-persistence-resized.result.jpg"
    );

    await filePersistence.downloadResizedJpegImage(
      "12345678",
      "300x300",
      destFilePath
    );

    expect(fs.existsSync(destFilePath)).toEqual(true);
  });
});
