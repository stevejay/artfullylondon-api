import * as tagRepository from "./persistence/tag-repository";
import * as validator from "./validator";
import * as normaliser from "./normaliser";
import * as mapper from "./mapper";

export async function createTag(request) {
  const tag = normaliser.normaliseCreateTagRequest(request);
  validator.validateCreateTagRequest(tag);
  const dbTag = mapper.mapCreateTagRequest(tag);
  await tagRepository.createTag(dbTag);
  return mapper.mapSingleTagResponse(dbTag);
}

export async function deleteTag(request) {
  const tag = mapper.mapDeleteTagRequest(request);
  await tagRepository.deleteTag(tag.tagType, tag.id);
  return { acknowledged: true };
}

export async function getAllTags() {
  const dbTags = await tagRepository.getAll();
  return mapper.mapMultiTagsResponse(dbTags);
}

export async function getTagsByType(request) {
  validator.validateGetTagsByTypeRequest(request);
  const dbTags = await tagRepository.getByTagType(request.tagType);
  return mapper.mapMultiTagsResponse(dbTags);
}
