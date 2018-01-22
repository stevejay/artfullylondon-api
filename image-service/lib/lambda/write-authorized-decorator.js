'use strict';

const jwtDecode = require('jwt-decode');

module.exports = exports = function(handler) {
  return function(event, context, cb) {
    const token = jwtDecode(event.headers.Authorization);

    if (token['cognito:username'] === 'readonly') {
      cb(null, {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          error: '[401] readonly user cannot modify system',
        }),
      });
    } else {
      handler(event, context, cb);
    }
  };
};
