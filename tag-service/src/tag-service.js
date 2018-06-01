import { ensure } from "ensure-request";
import normalise from "normalise-request";
import groupBy from "lodash.groupby";
import * as tagRepository from "./tag-repository";
import * as id from "./id";
import normaliser from "./domain/normaliser";
import constraints from "./domain/constraints";
import * as mappings from "./domain/mappings";
import ensureErrorHandler from "./domain/ensure-error-handler";

const createTagConstraint = {
  type: constraints.type,
  label: constraints.label
};

export async function createTag(request) {
  normalise(request, normaliser);
  ensure(request, createTagConstraint, ensureErrorHandler);

  const tagId = id.createTagIdFromLabel(request.type, request.label);
  const tag = mappings.mapRequestToDbTag(tagId, request);

  await tagRepository.saveTag(tag);
  return { tag: { id: tagId, label: request.label } };
}

export async function deleteTag(request) {
  const tagId = id.createTagId(request.type, request.idPart);
  await tagRepository.deleteTag(request.type, tagId);
}

export async function getAllTags() {
  const dbResponse = await tagRepository.getAll();
  const items = dbResponse.map(mappings.mapDbTagToResponse);
  const tags = groupBy(items, _extractTagTypeFromId);
  return { tags: tags };
}

export async function getTagsByType(request) {
  ensure(request, { tagType: constraints.type }, ensureErrorHandler);
  const dbResponse = await tagRepository.getAllByTagType(request.tagType);
  const tags = dbResponse.map(mappings.mapDbTagToResponse);
  return { tags: { [request.tagType]: tags } };
}

function _extractTagTypeFromId(item) {
  return item.id.substring(0, item.id.indexOf("/"));
}
