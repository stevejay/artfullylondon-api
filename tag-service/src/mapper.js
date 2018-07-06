import * as idGenerator from "./id-generator";

export function mapCreateTagRequest(request) {
  const id = idGenerator.createTagId(request.tagType, request.label);
  return {
    id,
    tagType: request.tagType,
    label: request.label
  };
}
