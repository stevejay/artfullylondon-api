export function mapLambdaEvent(event) {
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
