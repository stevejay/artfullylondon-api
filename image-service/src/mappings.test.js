"use strict";

const mappings = require("./mappings");

describe("mappings", () => {
  describe("mapRequestToDbItem", () => {
    it("should map a request", () => {
      const request = {
        imageType: "venue",
        id: "image-1",
        mimeType: "image/png",
        sourceUrl: "http://test.com/image.png",
        width: 500,
        height: 600,
        resizeVersion: 3,
        dominantColor: "440000"
      };

      const result = mappings.mapRequestToDbItem(request);

      expect(result.imageType).toEqual("venue");
      expect(result.id).toEqual("image-1");
      expect(result.mimeType).toEqual("image/png");
      expect(result.sourceUrl).toEqual("http://test.com/image.png");
      expect(result.width).toEqual(500);
      expect(result.height).toEqual(600);
      expect(result.resizeVersion).toEqual(3);
      expect(result.dominantColor).toEqual("440000");
      expect(result.modifiedDate).toEqual(
        expect.stringMatching(
          /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})Z$/
        )
      );
    });
  });

  describe("mapDbItemToResponse", () => {
    it("should map an item", () => {
      const item = {
        imageType: "venue",
        id: "image-1",
        mimeType: "image/png",
        sourceUrl: "http://test.com/image.png",
        width: 500,
        height: 600,
        dominantColor: "440000",
        resizeVersion: 4,
        modifiedDate: "2012-10-06T04:13:00.000Z"
      };

      const result = mappings.mapDbItemToResponse(item);

      expect(result.imageType).toEqual("venue");
      expect(result.id).toEqual("image-1");
      expect(result.mimeType).toEqual("image/png");
      expect(result.sourceUrl).toEqual("http://test.com/image.png");
      expect(result.width).toEqual(500);
      expect(result.height).toEqual(600);
      expect(result.ratio).toEqual(1.2);
      expect(result.resizeVersion).toEqual(4);
      expect(result.dominantColor).toEqual("440000");
      expect(result.modifiedDate).toEqual("2012-10-06T04:13:00.000Z");
    });

    it("should map an item with no dominantColor value", function() {
      const item = {
        imageType: "venue",
        id: "image-1",
        mimeType: "image/png",
        sourceUrl: "http://test.com/image.png",
        width: 500,
        height: 600,
        modifiedDate: "2012-10-06T04:13:00.000Z"
      };

      const result = mappings.mapDbItemToResponse(item);

      expect(result.dominantColor).toEqual(undefined);
      expect(result.resizeVersion).toEqual(0);
    });
  });
});
