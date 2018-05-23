"use strict";

const ensure = require("ensure-request").ensure;
const normalise = require("normalise-request");
const groupBy = require("lodash.groupby");
const tagRepository = require("./tag-repository");
const id = require("./id");
const normaliser = require("./domain/normaliser");
const constraints = require("./domain/constraints");
const mappings = require("./domain/mappings");
const ensureErrorHandler = require("./domain/ensure-error-handler");

const createTagConstraint = {
  type: constraints.type,
  label: constraints.label
};

exports.createTag = async function(request) {
  normalise(request, normaliser);
  ensure(request, createTagConstraint, ensureErrorHandler);

  const tagId = id.createTagIdFromLabel(request.type, request.label);
  const tag = mappings.mapRequestToDbTag(tagId, request);

  await tagRepository.saveTag(tag);
  return { tag: { id: tagId, label: request.label } };
};

exports.deleteTag = async function(request) {
  const tagId = id.createTagId(request.type, request.idPart);
  await tagRepository.deleteTag(request.type, tagId);
};

exports.getAllTags = async function() {
  const dbResponse = await tagRepository.getAll();
  const items = dbResponse.map(mappings.mapDbTagToResponse);
  const tags = groupBy(items, _extractTagTypeFromId);
  return { tags: tags };
};

exports.getTagsByType = async function(request) {
  ensure(request, { tagType: constraints.type }, ensureErrorHandler);
  const dbResponse = await tagRepository.getAllByTagType(request.tagType);
  const tags = dbResponse.map(mappings.mapDbTagToResponse);
  return { tags: { [request.tagType]: tags } };
};

function _extractTagTypeFromId(item) {
  return item.id.substring(0, item.id.indexOf("/"));
}
