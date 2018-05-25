"use strict";

module.exports = exports = function(handler, maxAgeSeconds) {
  return async function(event, context) {
    const isPublic = event.resource.startsWith("/public/");

    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    };

    if (isPublic) {
      headers["cache-control"] = "public, max-age=" + maxAgeSeconds;
    }

    const handlerResult = await handler(event, context);
    return { statusCode: 200, headers, body: JSON.stringify(handlerResult) };
  };
};
