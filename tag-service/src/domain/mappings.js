export function mapRequestToDbTag(id, request) {
  return {
    id: id,
    tagType: request.type,
    label: request.label
  };
}

export function mapDbTagToResponse(dbTag) {
  return {
    id: dbTag.id,
    label: dbTag.label
  };
}
