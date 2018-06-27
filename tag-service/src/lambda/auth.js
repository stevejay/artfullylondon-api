import { AwsJwtVerifier } from "aws-jwt-verifier";
import AuthPolicy from "aws-auth-policy";
import request from "request-promise-native";
import * as log from "loglevel";

// TODO cache the response
async function getJWKSJson(uri) {
  return await request({ uri, json: false, method: "GET" });
}

function getAuthorizationTokenFromEvent(event) {
  const header = event.headers
    ? event.headers.Authorization
    : event.authorizationToken; // TODO remove this?
  if (!header) {
    throw new Error("No Authorization header found");
  }
  return header.replace(/^Bearer /, "");
}

function verifyJWT(token, jwksJson) {
  const awsJwtVerifier = new AwsJwtVerifier({
    jwksJson,
    tokenType: process.env.AUTH_JWT_TOKEN_TYPE,
    iss: process.env.AUTH_JWT_ISSUER
  });
  const result = awsJwtVerifier.verify(token);
  if (result.is_ok()) {
    const decodedToken = result.unwrap();
    if (decodedToken.payload.aud !== process.env.AUTH_JWT_AUDIENCE) {
      throw new Error("Authorization header is not for expected audience");
    }
    return decodedToken;
  } else {
    throw new Error(result.unwrap_err());
  }
}

function getResourceInfoFromMethodArn(methodArn) {
  if (!methodArn) {
    throw new Error("methodArn not found");
  }
  const arnParts = methodArn.split(":");
  const apiGatewayParts = arnParts[5].split("/");
  return {
    accountId: arnParts[4],
    region: arnParts[3],
    restApiId: apiGatewayParts[0],
    stage: apiGatewayParts[1],
    method: apiGatewayParts[2]
  };
}

function createPolicy(decodedToken, resourceInfo) {
  const authPolicy = new AuthPolicy(decodedToken.sub, resourceInfo.accountId, {
    region: resourceInfo.region,
    restApiId: resourceInfo.restApiId,
    stage: resourceInfo.stage
  });
  authPolicy.allowMethod(AuthPolicy.HttpVerb.ALL, "/*");
  return authPolicy.build();
}

function addContextToPolicy(decodedToken, policy) {
  return {
    ...policy,
    context: {
      cognitoUsername: decodedToken.payload["cognito:username"],
      isEditor: (decodedToken.payload["cognito:groups"] || []).includes(
        "editors"
      )
    },
    principalId: decodedToken.payload.sub
  };
}

async function handlerImpl(event) {
  const jwksJson = await getJWKSJson(process.env.AUTH_JWKS_URL);
  const token = getAuthorizationTokenFromEvent(event);
  const decodedToken = verifyJWT(token, jwksJson);
  const resourceInfo = getResourceInfoFromMethodArn(event.methodArn);
  const policy = createPolicy(decodedToken, resourceInfo);
  return addContextToPolicy(decodedToken, policy);
}

export function handler(event, context, cb) {
  handlerImpl(event)
    .then(policy => cb(null, policy))
    .catch(err => {
      log.error(err.message);
      cb(new Error("Unauthorized"));
    });
}
