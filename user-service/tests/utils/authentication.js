import * as jsonWebKey from "json-web-key";
import * as yaml from "js-yaml";
import * as fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

const DEV_ENV_VARS = readDevelopmentEnvVars();
const KEY_ID = "12345678";

export function getJWKSet() {
  const publicPem = getRsaPublicPemFile();
  const webKey = jsonWebKey.fromPEM(publicPem.replace(/\n|\r\n/g, ""));
  return {
    keys: [
      {
        ...webKey.toJSON(),
        alg: "RS256",
        use: "sig",
        kid: KEY_ID
      }
    ]
  };
}

export function createAuthToken(userId) {
  return `Bearer ${createJWT(userId)}`;
}

function createJWT(userId = "email|cccccccccccccccccccccccc") {
  const privatePem = getRsaPrivatePemFile();
  return jwt.sign(
    {
      sub: userId,
      aud: DEV_ENV_VARS.AUTH_JWT_AUDIENCE,
      iss: DEV_ENV_VARS.AUTH_JWT_ISSUER,
      exp: 9999999999,
      iat: 1111111111
    },
    privatePem,
    {
      algorithm: "RS256",
      keyid: KEY_ID
    }
  );
}

function getRsaPublicPemFile() {
  return fs.readFileSync(path.resolve(__dirname, "./rsa-public.pem"), "utf8");
}

function getRsaPrivatePemFile() {
  return fs.readFileSync(path.resolve(__dirname, "./rsa-private.pem"), "utf8");
}

function readDevelopmentEnvVars() {
  return yaml.safeLoad(
    fs.readFileSync(path.resolve(__dirname, "../../env.yml"), "utf8")
  ).development;
}
