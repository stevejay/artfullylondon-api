'use strict';

const co = require('co');
const errorHandler = require('./error-handler');

module.exports = exports = function(handler, maxAgeSeconds) {
  return function(event, context, cb) {
    co(function*() {
      const isPublic = event.resource.startsWith('/public/');

      const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      };

      const handlerResult = yield handler(event);
      const body = JSON.stringify(handlerResult);

      if (isPublic) {
        headers['Cache-Control'] = 'public, max-age=' + maxAgeSeconds;
      }

      cb(null, { statusCode: 200, headers, body });
    }).catch(err => errorHandler(cb, err));
  };
};
