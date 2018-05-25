"use strict";

const etag = require("./etag");

const ARTFULLY_CACHE_HEADER_KEY = "X-Artfully-Cache";

module.exports = exports = function(handler, maxAgeSeconds) {
  return async function(event, context) {
    const isPublic = event.resource.startsWith("/public/");
    const ifNoneMatchHeader = event.headers["If-None-Match"];

    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      [ARTFULLY_CACHE_HEADER_KEY]: "Miss"
    };

    if (isPublic && !!ifNoneMatchHeader) {
      const key = event.path.replace("/event-service/public/", "");
      const eTag = await etag.tryGetETagFromRedis(key);

      if (eTag === ifNoneMatchHeader) {
        headers[ARTFULLY_CACHE_HEADER_KEY] = "Hit";

        return {
          statusCode: 304,
          headers
        };
      }
    }

    const handlerResult = await handler(event, context);

    const body = JSON.stringify(handlerResult);
    let result = null;

    if (!isPublic) {
      result = { statusCode: 200, headers, body };
    } else {
      const etagValue = etag.getETagValue(body);

      headers["etag"] = etagValue;
      headers["cache-control"] = "public, max-age=" + maxAgeSeconds;

      if (ifNoneMatchHeader === etagValue) {
        result = { statusCode: 304, headers };
      } else {
        result = { statusCode: 200, headers, body };
      }
    }

    return result;
  };
};
