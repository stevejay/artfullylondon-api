import "./xray-setup";
import * as log from "loglevel";
import * as jwksClient from "./jwks-client";
import AuthPolicy from "./auth-policy";
import * as authToken from "./auth-token";

const VERIFY_OPTIONS = {
  algorithms: ["RS256"],
  audience: process.env.AUTH_JWT_AUDIENCE,
  issuer: process.env.AUTH_JWT_ISSUER
};

async function handlerImpl(event) {
  const token = authToken.getFromEvent(event);
  const payload = await jwksClient.verifyJWT(token, VERIFY_OPTIONS);
  const authPolicy = new AuthPolicy(payload.sub, event.methodArn);
  authPolicy.allowMethod(AuthPolicy.HttpVerb.ALL, "/*");
  const policy = authPolicy.build();
  return {
    ...policy,
    context: {
      cognitoUsername: payload["cognito:username"],
      isEditor: (payload["cognito:groups"] || []).includes("editors")
    }
  };
}

export function handler(event, context, cb) {
  handlerImpl(event)
    .then(policy => cb(null, policy))
    .catch(err => {
      log.error(err.message, err.stack);
      cb(new Error("Unauthorized"));
    });
}
