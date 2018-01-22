'use strict';

const co = require('co');
const entity = require('../entity/entity');
const errorHandler = require('./error-handler');
const etag = require('./etag');

const ARTFULLY_CACHE_HEADER_KEY = 'X-Artfully-Cache';

module.exports = (exports = (handler, maxAgeSeconds) => {
  return (event, context, cb) => {
    co(function*() {
      const isPublic = entity.isPublicRequest(event);
      const ifNoneMatchHeader = event.headers['If-None-Match'];

      const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        [ARTFULLY_CACHE_HEADER_KEY]: 'Miss'
      };

      if (isPublic && !!ifNoneMatchHeader) {
        const key = event.path.replace('/event-service/public/', '');
        const eTag = yield etag.tryGetETagFromRedis(key);

        if (eTag === ifNoneMatchHeader) {
          (headers[ARTFULLY_CACHE_HEADER_KEY] = 'Hit'), cb(null, {
            statusCode: 304,
            headers
          });
          return;
        }
      }

      const handlerResult = yield handler(event);
      const body = JSON.stringify(handlerResult);
      let result = null;

      if (!isPublic) {
        result = { statusCode: 200, headers, body };
      } else {
        const etagValue = etag.getETagValue(body);

        headers['ETag'] = etagValue;
        headers['Cache-Control'] = 'public, max-age=' + maxAgeSeconds;

        if (ifNoneMatchHeader === etagValue) {
          result = { statusCode: 304, headers };
        } else {
          result = { statusCode: 200, headers, body };
        }
      }

      cb(null, result);
    }).catch(err => errorHandler(cb, err));
  };
});
