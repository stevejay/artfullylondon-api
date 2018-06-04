import groupBy from "lodash.groupby";
import * as idGenerator from "./id-generator";

export function mapLambdaRequest(event) {
  const request = {
    type: event.pathParameters.type,
    idPart: event.pathParameters.idPart
  };

  if (event.body) {
    request.label = JSON.parse(event.body).label;
  }

  return request;
}

export function mapLambdaResponse(result, statusCode = 200) {
  const response = {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(result)
  };

  if (statusCode === 401) {
    response.headers["Access-Control-Allow-Credentials"] = true;
  }

  return response;
}

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
  const tags = groupBy(items, extractTagTypeFromId);
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
