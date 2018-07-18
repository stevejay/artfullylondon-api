import * as tagRepository from "./persistence/tag-repository";
import * as validator from "./validator";
import * as normaliser from "./normaliser";
import * as mapper from "./mapper";
import * as authorizer from "./authorizer";

export default {
  Query: {
    async tags(__, request) {
      return { nodes: await tagRepository.getByTagType(request.tagType) };
    }
  },
  Mutation: {
    async createTag(__, request, context) {
      authorizer.checkUserIsAuthorizedForMutation(context);
      const tag = normaliser.normaliseCreateTagRequest(request.input);
      validator.validateCreateTagRequest(tag);
      const dbTag = mapper.mapCreateTagRequest(tag);
      await tagRepository.createTag(dbTag);
      return { node: dbTag };
    },
    async deleteTag(__, request, context) {
      authorizer.checkUserIsAuthorizedForMutation(context);
      await tagRepository.deleteTag(request.input.tagType, request.input.id);
      return { ok: true };
    }
  }
};
