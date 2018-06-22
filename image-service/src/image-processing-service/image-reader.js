import im from "imagemagick";
import dominantColor from "dominant-color";

export async function getImageMetadata(pathToImage) {
  const features = await new Promise((resolve, reject) => {
    im.identify(pathToImage, (err, features) => {
      if (err) {
        reject(err);
      } else {
        resolve(features);
      }
    });
  });

  await new Promise((resolve, reject) =>
    dominantColor(pathToImage, (err, color) => {
      if (err) {
        reject(err);
      } else {
        features.dominantColor = color; // e.g., '5b6c6e'
        resolve(features);
      }
    })
  );

  const mimeType = getMimeTypeFromFormat(features.format);

  return {
    mimeType,
    width: features.width,
    height: features.height,
    dominantColor: features.dominantColor
  };
}

function getMimeTypeFromFormat(format) {
  switch (format) {
    case "PNG":
      return "image/png";
    case "JPEG":
      return "image/jpeg";
    case "WEBP":
      return "image/webp";
    default:
      throw new Error(`Unknown file format: ${format}`);
  }
}
