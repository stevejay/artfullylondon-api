import * as mapper from "./mapper";
import * as imageType from "../types/image-type";

describe("mapImageDataToDb", () => {
  it("should map the image data", () => {
    const request = {
      imageType: imageType.VENUE,
      id: "image-1",
      mimeType: "image/png",
      sourceUrl: "http://test.com/image.png",
      width: 500,
      height: 600,
      resizeVersion: 3,
      dominantColor: "440000"
    };

    const result = mapper.mapImageDataToDb(request);

    expect(result).toEqual({
      imageType: imageType.VENUE,
      id: "image-1",
      mimeType: "image/png",
      sourceUrl: "http://test.com/image.png",
      width: 500,
      height: 600,
      resizeVersion: 3,
      dominantColor: "440000",
      modifiedDate: expect.stringMatching(
        /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})Z$/
      )
    });
  });
});

describe("mapImageToResponse", () => {
  it("should map an image", () => {
    const image = {
      imageType: imageType.VENUE,
      id: "image-1",
      mimeType: "image/png",
      sourceUrl: "http://test.com/image.png",
      width: 500,
      height: 600,
      dominantColor: "440000",
      resizeVersion: 4,
      modifiedDate: "2012-10-06T04:13:00.000Z"
    };

    const result = mapper.mapImageToResponse(image);

    expect(result).toEqual({
      imageType: imageType.VENUE,
      id: "image-1",
      mimeType: "image/png",
      sourceUrl: "http://test.com/image.png",
      width: 500,
      height: 600,
      ratio: 1.2,
      dominantColor: "440000",
      resizeVersion: 4,
      modifiedDate: "2012-10-06T04:13:00.000Z"
    });
  });

  it("should map a minimal image", function() {
    const image = {
      imageType: imageType.VENUE,
      id: "image-1",
      mimeType: "image/png",
      sourceUrl: "http://test.com/image.png",
      width: 500,
      height: 600,
      modifiedDate: "2012-10-06T04:13:00.000Z"
    };

    const result = mapper.mapImageToResponse(image);
    expect(result.dominantColor).toBeUndefined();
    expect(result.resizeVersion).toEqual(0);
  });
});
