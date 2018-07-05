import "./xray-setup";
import * as jwksClient from "./jwks-client";
import AuthPolicy from "aws-auth-policy";
import * as log from "loglevel";

function getAuthorizationToken(event) {
  const header = event.headers.Authorization;
  if (!header) {
    throw new Error("No Authorization header found");
  }
  return header.replace(/^Bearer /, "");
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

function createPolicy(payload, resourceInfo) {
  const authPolicy = new AuthPolicy(payload.sub, resourceInfo.accountId, {
    region: resourceInfo.region,
    restApiId: resourceInfo.restApiId,
    stage: resourceInfo.stage
  });
  authPolicy.allowMethod(AuthPolicy.HttpVerb.ALL, "/*");
  return authPolicy.build();
}

function addContextToPolicy(payload, policy) {
  return {
    ...policy,
    context: {
      cognitoUsername: payload["cognito:username"],
      isEditor: (payload["cognito:groups"] || []).includes("editors")
    }
  };
}

async function handlerImpl(event) {
  const token = getAuthorizationToken(event);
  const payload = await jwksClient.verifyJWT(token, {
    algorithms: ["RS256"],
    audience: process.env.AUTH_JWT_AUDIENCE,
    issuer: process.env.AUTH_JWT_ISSUER
  });
  const resourceInfo = getResourceInfoFromMethodArn(event.methodArn);
  const policy = createPolicy(payload, resourceInfo);
  return addContextToPolicy(payload, policy);
}

export function handler(event, context, cb) {
  handlerImpl(event)
    .then(policy => cb(null, policy))
    .catch(err => {
      log.error(err.message, err.stack);
      cb(new Error("Unauthorized"));
    });
}
