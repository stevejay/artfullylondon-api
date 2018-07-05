import jwksClient from "jwks-rsa";
import jwt from "jsonwebtoken";

const client = jwksClient({
  strictSsl: true,
  cache: true,
  cacheMaxEntries: 5,
  cacheMaxAge: 36000000, // 10 hours
  jwksUri: process.env.AUTH_JWKS_URL
});

function getKeyForJwtVerify(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err);
    } else {
      callback(null, key.publicKey || key.rsaPublicKey);
    }
  });
}

export async function verifyJWT(token, options) {
  return await new Promise((resolve, reject) => {
    jwt.verify(token, getKeyForJwtVerify, options, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
}
