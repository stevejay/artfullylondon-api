export function parseLambdaResponse(response) {
  return JSON.parse(response.replace(/^\{body=/, "").replace(/\}$/, ""));
}
