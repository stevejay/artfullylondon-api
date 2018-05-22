"use strict";

const jwt = require("jsonwebtoken");
const yaml = require("js-yaml");
const fs = require("fs");

module.exports.sync = fn =>
  fn.then(res => () => res).catch(err => () => {
    throw err;
  });

function readEnvVars() {
  const doc = yaml.safeLoad(fs.readFileSync("./env.yml", "utf8"));
  return doc.development;
}

const ENV_VARS = readEnvVars();

function createJWT(userId = "email|586a245e0bdcab0a0ea0d11b") {
  return jwt.sign(
    {
      iss: `https://${ENV_VARS.AUTH0_MANAGEMENT_API_DOMAIN}/`,
      sub: userId,
      aud: ENV_VARS.AUTH0_CLIENT_ID,
      iat: 1526931280,
      exp: 9926967280
    },
    new Buffer(ENV_VARS.AUTH0_CLIENT_SECRET, "base64")
  );
}

module.exports.createAuthValue = function(userId) {
  return `Bearer ${createJWT(userId)}`;
};
