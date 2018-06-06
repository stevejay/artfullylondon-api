import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import * as log from "loglevel";

function generatePolicy(principalId, methodArn) {
  if (!methodArn) {
    throw new Error("No methodArn to generate policy");
  }

  const matches = methodArn.match(
    /^([^/]+\/(development|staging|production))\//
  );

  if (!matches) {
    throw new Error("No match found in methodArn");
  }

  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: "Allow",
          Resource: matches[1] + "/*"
        }
      ]
    }
  };
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

async function handlerImpl(event) {
  try {
    const authHeader = event.headers
      ? event.headers.Authorization
      : event.authorizationToken;

    if (!authHeader) {
      throw new Error("No auth header");
    }

    const token = authHeader.replace(/^Bearer /, "");
    const signatureAlgorithm = process.env.AUTH0_SIGNATURE_ALGORITHM;
    const signingKeyOrSecret = await getSigningKeyOrSecret(signatureAlgorithm);
    const decoded = await verifyToken(
      token,
      signingKeyOrSecret,
      signatureAlgorithm,
      process.env.AUTH0_CLIENT_ID
    );
    return { policy: generatePolicy(decoded.sub, event.methodArn) };
  } catch (err) {
    log.error(err.message);
    return { err: new Error("Unauthorized") };
  }
}

export function handler(event, context, cb) {
  handlerImpl(event)
    .then(result => {
      if (result.err) {
        cb(result.err);
      } else {
        cb(null, result.policy);
      }
    })
    .catch(cb);
}
