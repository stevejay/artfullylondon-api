'use strict';

module.exports.mapRequestToDbTag = function(id, request) {
  return {
    id: id,
    tagType: request.type,
    label: request.label,
  };
};

module.exports.mapDbTagToResponse = function(dbTag) {
  return {
    id: dbTag.id,
    label: dbTag.label,
  };
};
