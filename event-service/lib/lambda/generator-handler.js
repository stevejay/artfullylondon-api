'use strict';

const co = require('co');
const errorHandler = require('./error-handler');

module.exports = (exports = handler => {
  return (event, context, cb) => {
    co(function*() {
      const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      };

      const handlerResult = yield handler(event);
      const body = JSON.stringify(handlerResult);
      const result = { statusCode: 200, headers, body };

      cb(null, result);
    }).catch(err => errorHandler(cb, err));
  };
});
