const MIN_IMAGE_WIDTH = 450;
const MIN_IMAGE_HEIGHT = MIN_IMAGE_WIDTH;
const MAX_IMAGE_WIDTH = 6000;
const MAX_IMAGE_HEIGHT = MAX_IMAGE_WIDTH;

export function validateImageMetadata(metadata) {
  if (metadata.width < MIN_IMAGE_WIDTH && metadata.height < MIN_IMAGE_HEIGHT) {
    throw new Error(
      `[400] Image is too small (${metadata.width}x${metadata.height})`
    );
  }

  if (metadata.width > MAX_IMAGE_WIDTH && metadata.height > MAX_IMAGE_HEIGHT) {
    throw new Error(
      `[400] Image is too large (${metadata.width}x${metadata.height})`
    );
  }
}
