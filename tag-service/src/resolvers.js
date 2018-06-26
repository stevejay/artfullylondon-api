import * as tagRepository from "./persistence/tag-repository";

export default {
  Query: {
    tags: async (__, { tagType }) =>
      tagType
        ? await tagRepository.getAllByTagType(tagType)
        : await tagRepository.getAll()
  }
};
