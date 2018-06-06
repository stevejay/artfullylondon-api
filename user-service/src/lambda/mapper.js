export function mapBasicRequest(event) {
  return {
    userId: event.requestContext.authorizer.principalId
  };
}

export function mapGetWatchesRequest(event) {
  let request = mapBasicRequest(event);
  request.entityType = event.pathParameters.entityType;
  return request;
}

export function mapUpdateWatchesRequest(event) {
  let request = mapGetWatchesRequest(event);

  if (event.body) {
    request = { ...JSON.parse(event.body), ...request };
  }

  return request;
}

export function mapUpdatePreferencesRequest(event) {
  const request = mapBasicRequest(event);

  if (event.body) {
    request.preferences = JSON.parse(event.body);
  }

  return request;
}

export function mapResponse(result, statusCode = 200) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(result)
  };
}
