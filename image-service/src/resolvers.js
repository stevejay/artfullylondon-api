import * as imageService from "./image-service";
import * as validator from "./validator";

export default {
  Query: {
    async image(__, request) {
      return await imageService.getImageData(request);
    }
  },
  Mutation: {
    async addImage(__, request, context) {
      validator.validateUserForMutation(context);
      return await imageService.addImage(request.input);
    },
    async reprocessAllImages(__, ___, context) {
      validator.validateUserForMutation(context);
      return await imageService.startReprocessingImages();
    }
  }
};
