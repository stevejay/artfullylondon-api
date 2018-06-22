import * as imageResizer from "./image-resizer";
import * as fsWrapper from "../library-wrappers/fs-wrapper";
import * as filePersistence from "../file-persistence";

export async function run(resizeSize, imageId, imageFilePath) {
  const resizeSuffix = createTempResizedFileExtension(resizeSize.suffix);
  const resizedFilePath = imageFilePath + resizeSuffix;
  await imageResizer.resize(
    imageFilePath,
    resizedFilePath,
    resizeSize.width,
    resizeSize.height
  );
  const body = await fsWrapper.readFile(resizedFilePath);
  await filePersistence.uploadResizedJpegImage(
    imageId,
    resizeSize.suffix,
    body
  );
  fsWrapper.deleteFile(resizedFilePath);
}

function createTempResizedFileExtension(resizeSizeSuffix) {
  return "." + resizeSizeSuffix + ".jpg";
}
