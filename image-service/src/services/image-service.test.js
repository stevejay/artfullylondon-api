"use strict";

const constants = require("../constants");
const imageProcessor = require("../image/image-processor");
const imageService = require("./image-service");
const imageRepository = require("../persistence/image-repository");
const entityIterationService = require("./entity-iteration-service");

process.env.SERVERLESS_REPROCESS_IMAGES_TOPIC_ARN = "ReprocessImagesTopicArn";

const sync = fn =>
  fn.then(res => () => res).catch(err => () => {
    throw err;
  });

describe("image-service", () => {
  describe("startReprocessingImages", () => {
    it("should handle a valid request", async () => {
      entityIterationService.startIteration = jest.fn().mockResolvedValue();

      await imageService.startReprocessingImages();

      expect(entityIterationService.startIteration).toHaveBeenCalledWith(
        constants.ITERATE_IMAGES_ACTION_ID,
        process.env.SERVERLESS_REPROCESS_IMAGES_TOPIC_ARN
      );
    });
  });

  describe("reprocessNextImage", () => {
    it("should handle processing an image and continuing the iteration", async () => {
      imageRepository.getNextImage = jest
        .fn()
        .mockResolvedValue({ id: "image-2" });
      imageProcessor.reprocessImage = jest.fn().mockResolvedValue();
      entityIterationService.throttleIteration = jest.fn().mockResolvedValue();
      entityIterationService.invokeNextIteration = jest
        .fn()
        .mockResolvedValue();

      await imageService.reprocessNextImage("image-1", 12345678);

      expect(imageRepository.getNextImage).toHaveBeenCalledWith("image-1");
      expect(imageProcessor.reprocessImage).toHaveBeenCalledWith("image-2");
      expect(entityIterationService.throttleIteration).toHaveBeenCalled();

      expect(entityIterationService.invokeNextIteration).toHaveBeenCalledWith(
        "image-2",
        12345678,
        constants.ITERATE_IMAGES_ACTION_ID,
        "ReprocessImagesTopicArn"
      );
    });

    it("should handle an error when processing an image", async () => {
      imageRepository.getNextImage = jest
        .fn()
        .mockResolvedValue({ id: "image-2" });

      imageProcessor.reprocessImage = jest
        .fn()
        .mockRejectedValue(new Error("deliberately thrown"));

      entityIterationService.addIterationError = jest.fn().mockResolvedValue();
      entityIterationService.throttleIteration = jest.fn().mockResolvedValue();
      entityIterationService.invokeNextIteration = jest
        .fn()
        .mockResolvedValue();

      await imageService.reprocessNextImage("image-1", 12345678);

      expect(imageRepository.getNextImage).toHaveBeenCalled();
      expect(imageProcessor.reprocessImage).toHaveBeenCalled();
      expect(entityIterationService.addIterationError).toHaveBeenCalled();
      expect(entityIterationService.throttleIteration).toHaveBeenCalled();

      expect(entityIterationService.invokeNextIteration).toHaveBeenCalledWith(
        "image-2",
        12345678,
        constants.ITERATE_IMAGES_ACTION_ID,
        "ReprocessImagesTopicArn"
      );
    });

    it("should handle reaching the end of the iteration", async () => {
      imageRepository.getNextImage = jest.fn().mockResolvedValue(null);

      entityIterationService.invokeNextIteration = jest
        .fn()
        .mockResolvedValue();

      await imageService.reprocessNextImage("image-99", 12345678);

      expect(imageRepository.getNextImage).toHaveBeenCalledWith("image-99");

      expect(entityIterationService.invokeNextIteration).toHaveBeenCalledWith(
        null,
        12345678,
        constants.ITERATE_IMAGES_ACTION_ID,
        "ReprocessImagesTopicArn"
      );
    });
  });

  describe("getImageData", () => {
    it("should handle a valid request", async () => {
      imageRepository.getImage = jest.fn().mockResolvedValue({
        imageType: "event",
        id: "1234",
        mimeType: "file/png",
        sourceUrl: "http://test.com/foo.png",
        width: 100,
        height: 200,
        dominantColor: "FFFFFF",
        resizeVersion: 4,
        modifiedDate: "2016-10-20"
      });

      const result = await imageService.getImageData("1234");

      expect(result).toEqual({
        imageType: "event",
        id: "1234",
        mimeType: "file/png",
        sourceUrl: "http://test.com/foo.png",
        width: 100,
        height: 200,
        ratio: 2,
        dominantColor: "FFFFFF",
        resizeVersion: 4,
        modifiedDate: "2016-10-20"
      });

      expect(imageRepository.getImage).toHaveBeenCalledWith("1234");
    });
  });

  describe("addImageToStore", () => {
    it("should handle a valid request", async () => {
      imageProcessor.processImage = jest.fn().mockResolvedValue();

      await imageService.addImageToStore({
        type: "event",
        id: "4330825a-3d75-11e7-a919-92ebcb67fe33",
        url: "http://test.com/foo.png"
      });

      expect(imageProcessor.processImage).toHaveBeenCalledWith(
        "event",
        "4330825a3d7511e7a91992ebcb67fe33",
        "http://test.com/foo.png"
      );
    });
  });
});
