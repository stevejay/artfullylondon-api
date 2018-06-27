import * as idGenerator from "./id-generator";

export function mapCreateTagRequest(request) {
  const id = idGenerator.createFromLabel(request.tagType, request.label);
  return {
    id,
    tagType: request.tagType,
    label: request.label
  };
}

export function mapDeleteTagRequest(request) {
  return {
    id: request.id,
    tagType: extractTagTypeFromId(request)
  };
}

function extractTagTypeFromId(item) {
  return item.id.substring(0, item.id.indexOf("/"));
}
