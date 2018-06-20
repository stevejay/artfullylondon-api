import _ from "lodash";
import etag from "etag";
import * as cache from "../cache";

const ARTFULLY_CACHE_HEADER_KEY = "X-Artfully-Cache";

export default function(handler, entityType, maxAgeSeconds = 1800) {
  return async function(event, context) {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      [ARTFULLY_CACHE_HEADER_KEY]: "Miss"
    };

    if (!_.isNil(event.ifNoneMatch)) {
      const eTag = await cache.getEntityEtag(entityType, event.id);
      if (eTag === event.ifNoneMatch) {
        headers[ARTFULLY_CACHE_HEADER_KEY] = "Hit";
        return { statusCode: 304, headers };
      }
    }

    const result = await handler(event, context);
    const etagValue = await cache.storeEntityEtag(
      entityType,
      event.id,
      result.body
    );
    headers["etag"] = etagValue;
    headers["cache-control"] = "public, max-age=" + maxAgeSeconds;
    return { statusCode: 200, headers, body: handlerResult.body };
  };
}
