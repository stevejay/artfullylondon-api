'use strict';

const log = require('loglevel');

const ERROR_CODE_REGEX = /^\[(\d\d\d)\]/;

module.exports = exports = (cb, err) => {
  let statusCode = null;

  if (process.env.NODE_ENV !== 'test') {
    log.error(err);
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  };

  if (err.code === 'ConditionalCheckFailedException') {
    err.message = '[400] Stale Data';
    statusCode = 400;
  } else {
    const errorCodeMatch = (err.message || '').match(ERROR_CODE_REGEX);

    if (!errorCodeMatch) {
      err.message = '[500] ' + err.message;
      statusCode = 500;
    } else {
      statusCode = parseInt(errorCodeMatch[1]);
    }
  }

  const body = JSON.stringify({ error: err.message });
  cb(null, { statusCode, headers, body });
};
