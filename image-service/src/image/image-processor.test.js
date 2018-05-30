"use strict";

const tmp = require("tmp");
const constants = require("../constants");
const imageRepository = require("../persistence/image-repository");
const imageProcessor = require("./image-processor");
const imageResizer = require("../image/image-resizer");
const file = require("../io/file");
const imageReader = require("../image/image-reader");
const s3 = require("../external-services/s3");

process.env.SERVERLESS_ORIGINAL_IMAGES_BUCKET_NAME = "OriginalImagesBucket";
process.env.SERVERLESS_RESIZED_IMAGES_BUCKET_NAME = "ResizedImagesBucket";

const sync = fn =>
  fn.then(res => () => res).catch(err => () => {
    throw err;
  });

describe("process-image", () => {
  describe("resizeImage", () => {
    it("should resize an image", async () => {
      imageResizer.resize = jest.fn().mockResolvedValue();
      file.readFile = jest.fn().mockResolvedValue("The Content");
      s3.putObjectToS3 = jest.fn().mockResolvedValue();

      await imageProcessor.resizeImage(
        [{ width: 120, height: 180, suffix: "120x180" }],
        "11223344aaaaaaaabbbbbbbbcccccccc",
        "/tmp/path"
      );

      expect(imageResizer.resize).toHaveBeenCalledWith(
        "/tmp/path",
        "/tmp/path.120x180.jpg",
        120,
        180
      );

      expect(file.readFile).toHaveBeenCalledWith("/tmp/path.120x180.jpg");

      expect(s3.putObjectToS3).toHaveBeenCalledWith({
        Bucket: "ResizedImagesBucket",
        Key: "11/22/11223344aaaaaaaabbbbbbbbcccccccc/120x180.jpg",
        Body: "The Content",
        ContentType: "image/jpeg"
      });
    });
  });

  describe("processImage", () => {
    it("should process a new image", async () => {
      imageRepository.tryGetImage = jest.fn().mockResolvedValue(null);
      tmp.tmpNameSync = jest.fn().mockReturnValue("/tmp/path");
      file.downloadFile = jest.fn().mockResolvedValue();
      imageReader.getImageFeatures = jest.fn().mockResolvedValue({
        width: 600,
        height: 1200,
        mimeType: "image/png",
        dominantColor: "440000"
      });
      file.readFile = jest.fn().mockResolvedValue("The Content");
      s3.putObjectToS3 = jest.fn().mockResolvedValue();
      imageProcessor.resizeImage = jest.fn().mockResolvedValue();
      imageRepository.saveImage = jest.fn().mockResolvedValue();
      file.deleteFile = jest.fn().mockResolvedValue();

      const result = await imageProcessor.processImage(
        "event",
        "11223344aaaaaaaabbbbbbbbcccccccc",
        "http://test.com/foo.png"
      );

      expect(result.image).toEqual(
        expect.objectContaining({
          id: "11223344aaaaaaaabbbbbbbbcccccccc",
          sourceUrl: "http://test.com/foo.png",
          imageType: "event",
          resizeVersion: constants.CURRENT_IMAGE_RESIZE_VERSION,
          mimeType: "image/png",
          width: 600,
          height: 1200,
          ratio: 2,
          dominantColor: "440000"
        })
      );

      expect(imageRepository.tryGetImage).toHaveBeenCalledWith(
        "11223344aaaaaaaabbbbbbbbcccccccc"
      );

      expect(tmp.tmpNameSync).toHaveBeenCalled();

      expect(file.downloadFile).toHaveBeenCalledWith(
        "http://test.com/foo.png",
        "/tmp/path"
      );

      expect(imageReader.getImageFeatures).toHaveBeenCalledWith("/tmp/path");
      expect(file.readFile).toHaveBeenCalledWith("/tmp/path");

      expect(s3.putObjectToS3).toHaveBeenCalledWith({
        Bucket: "OriginalImagesBucket",
        Key: "11/22/11223344aaaaaaaabbbbbbbbcccccccc.png",
        Body: "The Content",
        ContentType: "image/png"
      });

      expect(imageProcessor.resizeImage).toHaveBeenCalledWith(
        constants.RESIZE_SIZES,
        "11223344aaaaaaaabbbbbbbbcccccccc",
        "/tmp/path"
      );

      expect(imageRepository.saveImage).toHaveBeenCalled();
      expect(file.deleteFile).toHaveBeenCalled();
    });

    it("should throw an exception if the image already exists", async () => {
      imageRepository.tryGetImage = jest
        .fn()
        .mockResolvedValue({ id: "image-1" });

      expect(
        await sync(
          imageProcessor.processImage(
            "event",
            "image-1",
            "http://test.com/foo.png"
          )
        )
      ).toThrow(/Image Already Exists/);

      expect(imageRepository.tryGetImage).toHaveBeenCalledWith("image-1");
    });
  });

  describe("reprocessImage", () => {
    it("should short-circuit when processing an existing image that is at the current resize version", async () => {
      imageRepository.tryGetImage = jest.fn().mockResolvedValue({
        id: "11223344aaaaaaaabbbbbbbbcccccccc",
        sourceUrl: "http://test.com/foo.png",
        imageType: "event",
        resizeVersion: constants.CURRENT_IMAGE_RESIZE_VERSION,
        mimeType: "image/png",
        width: 600,
        height: 1200,
        dominantColor: "440000",
        modifiedDate: "2012-10-06T04:13:00.000Z"
      });

      const result = await imageProcessor.reprocessImage(
        "11223344aaaaaaaabbbbbbbbcccccccc"
      );

      expect(result).toEqual({
        image: {
          id: "11223344aaaaaaaabbbbbbbbcccccccc",
          sourceUrl: "http://test.com/foo.png",
          imageType: "event",
          resizeVersion: constants.CURRENT_IMAGE_RESIZE_VERSION,
          mimeType: "image/png",
          width: 600,
          height: 1200,
          ratio: 2,
          dominantColor: "440000",
          modifiedDate: "2012-10-06T04:13:00.000Z"
        }
      });

      expect(imageRepository.tryGetImage).toHaveBeenCalledWith(
        "11223344aaaaaaaabbbbbbbbcccccccc"
      );
    });

    it("should reprocess an existing image", async () => {
      imageRepository.tryGetImage = jest.fn().mockResolvedValue({
        id: "11223344aaaaaaaabbbbbbbbcccccccc",
        sourceUrl: "http://test.com/foo.png",
        imageType: "event",
        resizeVersion: constants.CURRENT_IMAGE_RESIZE_VERSION - 1,
        mimeType: "image/png",
        width: 600,
        height: 1200,
        dominantColor: "440000",
        modifiedDate: "2012-10-06T04:13:00.000Z"
      });

      tmp.tmpNameSync = jest.fn().mockReturnValue("/tmp/path");
      s3.getObjectFromS3 = jest.fn().mockResolvedValue();
      imageReader.getImageFeatures = jest.fn().mockResolvedValue({
        width: 600,
        height: 1200,
        mimeType: "image/png",
        dominantColor: "880000"
      });
      file.readFile = jest.fn().mockResolvedValue("The Content");
      s3.putObjectToS3 = jest.fn().mockResolvedValue();
      imageProcessor.resizeImage = jest.fn().mockResolvedValue();
      imageRepository.saveImage = jest.fn().mockResolvedValue();
      file.deleteFile = jest.fn().mockResolvedValue();

      const result = await imageProcessor.reprocessImage(
        "11223344aaaaaaaabbbbbbbbcccccccc"
      );
      expect(result.image).toEqual(
        expect.objectContaining({
          id: "11223344aaaaaaaabbbbbbbbcccccccc",
          sourceUrl: "http://test.com/foo.png",
          imageType: "event",
          resizeVersion: constants.CURRENT_IMAGE_RESIZE_VERSION,
          mimeType: "image/png",
          width: 600,
          height: 1200,
          ratio: 2,
          dominantColor: "880000"
        })
      );

      expect(imageRepository.tryGetImage).toHaveBeenCalledWith(
        "11223344aaaaaaaabbbbbbbbcccccccc"
      );

      expect(s3.getObjectFromS3).toHaveBeenCalledWith(
        "OriginalImagesBucket",
        "11/22/11223344aaaaaaaabbbbbbbbcccccccc.png",
        "/tmp/path"
      );

      expect(imageReader.getImageFeatures).toHaveBeenCalledWith("/tmp/path");
      expect(file.readFile).toHaveBeenCalledWith("/tmp/path");

      expect(s3.putObjectToS3).toHaveBeenCalledWith({
        Bucket: "OriginalImagesBucket",
        Key: "11/22/11223344aaaaaaaabbbbbbbbcccccccc.png",
        Body: "The Content",
        ContentType: "image/png"
      });

      expect(imageProcessor.resizeImage).toHaveBeenCalledWith(
        constants.RESIZE_SIZES,
        "11223344aaaaaaaabbbbbbbbcccccccc",
        "/tmp/path"
      );

      expect(imageRepository.saveImage).toHaveBeenCalled();
      expect(file.deleteFile).toHaveBeenCalled();
    });

    it("should throw an exception if the image does not already exist", async () => {
      imageRepository.tryGetImage = jest.fn().mockResolvedValue(null);

      expect(await sync(imageProcessor.reprocessImage("image-1"))).toThrow(
        /Image Data Not Found/
      );

      expect(imageRepository.tryGetImage).toHaveBeenCalledWith("image-1");
    });
  });
});
