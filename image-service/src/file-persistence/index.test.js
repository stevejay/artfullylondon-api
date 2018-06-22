import * as filePersistence from "./index";
import * as s3Client from "./s3-client";

process.env.SERVERLESS_ORIGINAL_IMAGES_BUCKET_NAME = "original-bucket";
process.env.SERVERLESS_RESIZED_IMAGES_BUCKET_NAME = "resized-bucket";

describe("uploadOriginalImage", () => {
  it("should save an original image", async () => {
    s3Client.putObjectToS3 = jest.fn().mockResolvedValue();
    await filePersistence.uploadOriginalImage(
      "12345678",
      "http://test.com/foo.png",
      "image/png",
      "some content"
    );
    expect(s3Client.putObjectToS3).toHaveBeenCalledWith(
      "original-bucket",
      "12/34/12345678.png",
      "image/png",
      "some content"
    );
  });
});

describe("uploadResizedJpegImage", () => {
  it("should save a resized image", async () => {
    s3Client.putObjectToS3 = jest.fn().mockResolvedValue();
    await filePersistence.uploadResizedJpegImage(
      "12345678",
      "300x300",
      "some content"
    );
    expect(s3Client.putObjectToS3).toHaveBeenCalledWith(
      "resized-bucket",
      "12/34/12345678/300x300.jpg",
      "image/jpeg",
      "some content"
    );
  });
});

describe("downloadOriginalImage", () => {
  it("should get an original image", async () => {
    s3Client.getObjectFromS3 = jest.fn().mockResolvedValue();
    await filePersistence.downloadOriginalImage(
      "12345678",
      "http://test.com/foo.png",
      "/some/file/path"
    );
    expect(s3Client.getObjectFromS3).toHaveBeenCalledWith(
      "original-bucket",
      "12/34/12345678.png",
      "/some/file/path"
    );
  });
});
