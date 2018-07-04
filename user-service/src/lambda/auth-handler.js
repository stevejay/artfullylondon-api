import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import AuthPolicy from "aws-auth-policy";
import * as log from "loglevel";

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

function getKeys(client) {
  return new Promise((resolve, reject) => {
    client.getKeys((err, keys) => {
      if (err) {
        reject(err);
      } else if (!keys.length) {
        reject(new Error("Empty keys returned"));
      } else {
        resolve(keys);
      }
    });
  });
}

function getSigningKey(client, kid) {
  return new Promise((resolve, reject) => {
    client.getSigningKey(kid, (err, key) => {
      if (err) {
        reject(err);
      } else {
        resolve(key.publicKey || key.rsaPublicKey);
      }
    });
  });
}

let auth0Client = null;

function getAuth0Client() {
  if (!auth0Client) {
    auth0Client = jwksClient({
      strictSsl: true,
      cache: true,
      cacheMaxEntries: 5,
      cacheMaxAge: 36000000, // 10 hours
      jwksUri: `https://${process.env.AUTH0_API_DOMAIN}/.well-known/jwks.json`
    });
  }

  return auth0Client;
}

async function getSigningKeyOrSecret(signatureAlgorithm) {
  switch (signatureAlgorithm) {
    case "HS256":
      return new Buffer(process.env.AUTH0_CLIENT_SECRET, "base64");
    case "RS256": {
      const client = getAuth0Client();
      const keys = await getKeys(client);
      return await getSigningKey(client, keys[0].kid);
    }
    default:
      throw new Error(`Unknown signature algorithm ${signatureAlgorithm}`);
  }
}

function verifyToken(token, signingKeyOrSecret, algorithm, audience) {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      signingKeyOrSecret,
      { algorithms: [algorithm], audience },
      (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      }
    );
  });
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

async function handlerImpl(event) {
  const token = getAuthorizationTokenFromEvent(event);
  const signatureAlgorithm = process.env.AUTH0_SIGNATURE_ALGORITHM;
  const signingKeyOrSecret = await getSigningKeyOrSecret(signatureAlgorithm);
  const decodedToken = await verifyToken(
    token,
    signingKeyOrSecret,
    signatureAlgorithm,
    process.env.AUTH0_CLIENT_ID
  );
  const resourceInfo = getResourceInfoFromMethodArn(event.methodArn);
  return createPolicy(decodedToken, resourceInfo);
}

export function handler(event, context, cb) {
  handlerImpl(event)
    .then(policy => cb(null, policy))
    .catch(err => {
      log.error(err.message);
      cb(new Error("Unauthorized"));
    });
}
