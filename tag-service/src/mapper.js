import _ from "lodash";
import * as idGenerator from "./id-generator";

export function mapCreateTagRequest(request) {
  const id = idGenerator.createFromLabel(request.type, request.label);

  return {
    id,
    tagType: request.type,
    label: request.label
  };
}

export function mapSingleTagResponse(dbTag) {
  return { tag: mapTagResponse(dbTag) };
}

export function mapMultiTagsResponse(dbResponse) {
  const items = dbResponse.map(mapTagResponse);
  const tags = _.groupBy(items, extractTagTypeFromId);
  return { tags };
}

function mapTagResponse(dbTag) {
  return {
    id: dbTag.id,
    label: dbTag.label
  };
}

function extractTagTypeFromId(item) {
  return item.id.substring(0, item.id.indexOf("/"));
}
