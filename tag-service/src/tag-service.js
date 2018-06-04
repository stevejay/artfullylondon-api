import * as tagRepository from "./tag-repository";
import * as idGenerator from "./id-generator";
import * as validator from "./validator";
import * as normaliser from "./normaliser";
import * as mapper from "./mapper";

export async function createTag(request) {
  request = normaliser.normaliseCreateTagRequest(request);
  validator.validateCreateTagRequest(request);
  const dbTag = mapper.mapCreateTagRequest(request);
  await tagRepository.createTag(dbTag);
  return mapper.mapSingleTagResponse(dbTag);
}

export async function deleteTag(request) {
  const id = idGenerator.join(request.type, request.idPart);
  await tagRepository.deleteTag(request.type, id);
  return { acknowledged: true };
}

export async function getAllTags() {
  const dbTags = await tagRepository.getAll();
  return mapper.mapMultiTagsResponse(dbTags);
}

export async function getTagsByType(request) {
  validator.validateGetTagsByTypeRequest(request);
  const dbTags = await tagRepository.getAllByTagType(request.type);
  return mapper.mapMultiTagsResponse(dbTags);
}
