import * as tagRepository from "./persistence/tag-repository";
import * as tagType from "./tag-type";
import * as validator from "./validator";
import * as normaliser from "./normaliser";
import * as mapper from "./mapper";
import * as auth from "./lambda/auth";

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
    createTag: async (__, request, c) => {
      console.log("REQUEST", JSON.stringify(request), JSON.stringify(c));
      // if (auth.isReadonlyUser(request)) {
      //   throw new Error("[401] readonly user cannot modify system");
      // }
      const tag = normaliser.normaliseCreateTagRequest(request.input.tag);
      validator.validateCreateTagRequest(tag);
      const dbTag = mapper.mapCreateTagRequest(tag);
      await tagRepository.createTag(dbTag);
      return { tag: dbTag };
    },
    deleteTag: async (__, request) => {
      const tag = mapper.mapDeleteTagRequest(request.input.tag);
      await tagRepository.deleteTag(tag.tagType, tag.id);
      return { ok: true };
    }
  }
};
