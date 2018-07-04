import * as tagRepository from "./persistence/tag-repository";
import * as tagType from "./tag-type";
import * as validator from "./validator";
import * as normaliser from "./normaliser";
import * as mapper from "./mapper";

export default {
  Query: {
    tags: () => ({
      medium: () => tagRepository.getByTagType(tagType.MEDIUM),
      style: () => tagRepository.getByTagType(tagType.STYLE),
      audience: () => tagRepository.getByTagType(tagType.AUDIENCE),
      geo: () => tagRepository.getByTagType(tagType.GEO)
    })
  },
  Mutation: {
    async createTag(__, request, context) {
      validator.validateUserForMutation(context);
      const tag = normaliser.normaliseCreateTagRequest(request.input.tag);
      validator.validateCreateTagRequest(tag);
      const dbTag = mapper.mapCreateTagRequest(tag);
      await tagRepository.createTag(dbTag);
      return { tag: dbTag };
    },
    async deleteTag(__, request, context) {
      validator.validateUserForMutation(context);
      const tag = mapper.mapDeleteTagRequest(request.input.tag);
      await tagRepository.deleteTag(tag.tagType, tag.id);
      return { ok: true };
    }
  }
};
