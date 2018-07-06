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

export function createEditorAuthToken() {
  return `Bearer ${createJWT(true)}`;
}

export function createReaderAuthToken() {
  return `Bearer ${createJWT(false)}`;
}

function createJWT(isEditor) {
  const privatePem = getRsaPrivatePemFile();
  return jwt.sign(
    {
      sub: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      aud: DEV_ENV_VARS.AUTH_JWT_AUDIENCE,
      "cognito:groups": isEditor ? ["editors"] : ["readers"],
      email_verified: true,
      event_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      token_use: DEV_ENV_VARS.AUTH_JWT_TOKEN_TYPE,
      auth_time: 1111111111,
      iss: DEV_ENV_VARS.AUTH_JWT_ISSUER,
      "cognito:username": "steve",
      exp: 9999999999,
      iat: 1111111111,
      email: "steve@test.com"
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
