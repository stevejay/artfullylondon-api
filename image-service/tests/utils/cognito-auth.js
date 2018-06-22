import jwt from "jsonwebtoken";

function createJWT(username) {
  return jwt.sign(
    {
      sub: "1234567890",
      "cognito:username": username,
      iat: 1526931280
    },
    new Buffer("some-secret", "base64")
  );
}

export const EDITOR_AUTH_TOKEN = createJWT("editor");
export const READONLY_AUTH_TOKEN = createJWT("readonly");
