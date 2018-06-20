export function parseLambdaResponse(response) {
  const bodyKey = "body=";
  const pos = response.indexOf(bodyKey);
  if (pos === -1) {
    throw new Error("could not parse lambda integration response");
  }
  const substr = response.substring(pos + bodyKey.length, response.length - 1);
  return JSON.parse(substr);
}
