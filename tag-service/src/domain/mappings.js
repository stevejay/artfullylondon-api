'use strict';

exports.mapRequestToDbTag = function(id, request) {
  return {
    id: id,
    tagType: request.type,
    label: request.label,
  };
};

exports.mapDbTagToResponse = function(dbTag) {
  return {
    id: dbTag.id,
    label: dbTag.label,
  };
};
