'use strict';

const co = require('co');
const ensure = require('ensure-request').ensure;
const normalise = require('normalise-request');
const groupBy = require('lodash.groupby');
const tagRepository = require('../persistence/tag-repository');
const id = require('../persistence/id');
const normaliser = require('../data/normaliser');
const constraints = require('../data/constraints');
const mappings = require('../data/mappings');
const ensureErrorHandler = require('../data/ensure-error-handler');

const createTagConstraint = {
  type: constraints.type,
  label: constraints.label,
};

module.exports.createTag = co.wrap(function*(request) {
  normalise(request, normaliser);
  ensure(request, createTagConstraint, ensureErrorHandler);

  const tagId = id.createTagIdFromLabel(request.type, request.label);
  const tag = mappings.mapRequestToDbTag(tagId, request);

  yield tagRepository.saveTag(tag);
  return { tag: { id: tagId, label: request.label } };
});

module.exports.deleteTag = co.wrap(function*(request) {
  const tagId = id.createTagId(request.type, request.idPart);
  yield tagRepository.deleteTag(request.type, tagId);
});

module.exports.getAllTags = co.wrap(function*() {
  const dbResponse = yield tagRepository.getAll();
  const items = dbResponse.map(mappings.mapDbTagToResponse);
  const tags = groupBy(items, _extractTagTypeFromId);
  return { tags: tags };
});

module.exports.getTagsByType = co.wrap(function*(request) {
  ensure(request, { tagType: constraints.type }, ensureErrorHandler);
  const dbResponse = yield tagRepository.getAllByTagType(request.tagType);
  const tags = dbResponse.map(mappings.mapDbTagToResponse);
  return { tags: { [request.tagType]: tags } };
});

function _extractTagTypeFromId(item) {
  return item.id.substring(0, item.id.indexOf('/'));
}
