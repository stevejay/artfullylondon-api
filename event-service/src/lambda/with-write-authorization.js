"use strict";

const jwtDecode = require("jwt-decode");

module.exports = exports = function(handler) {
  return async function(event, context) {
    const token = jwtDecode(event.headers.Authorization);

    if (token["cognito:username"] === "readonly") {
      return {
        statusCode: 401,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          error: "[401] readonly user cannot modify system"
        })
      };
    }

    return await handler(event, context);
  };
};
