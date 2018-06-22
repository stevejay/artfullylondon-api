import mappr from "mappr";
import fpPick from "lodash/fp/pick";

export const mapImageToResponse = mappr.compose(
  fpPick([
    "imageType",
    "id",
    "mimeType",
    "sourceUrl",
    "width",
    "height",
    "dominantColor",
    "resizeVersion",
    "modifiedDate"
  ]),
  {
    ratio: params => params.height / params.width,
    resizeVersion: params => params.resizeVersion || 0
  }
);

export const mapImageDataToDb = mappr.compose(
  fpPick([
    "imageType",
    "id",
    "mimeType",
    "sourceUrl",
    "width",
    "height",
    "dominantColor",
    "resizeVersion"
  ]),
  {
    modifiedDate: () => new Date(Date.now()).toISOString()
  }
);
