'use strict';

const etag = require('etag');
const log = require('loglevel');

module.exports.tryGetETagFromRedis = function*(key) {
  const redisClient = require('../external-services/redis')();

  try {
    redisClient.waitForReady();
    return yield redisClient.get(key);
  } catch (err) {
    log.error('error when querying redis: ' + err.message);
    return null;
  } finally {
    redisClient.quit();
  }
};

module.exports.writeETagToRedis = function*(key, objStr) {
  const redisClient = require('../external-services/redis')();

  try {
    redisClient.waitForReady();
    const value = etag(objStr);
    yield redisClient.set(key, value);
  } catch (err) {
    log.error('error when writing to redis: ' + err.message);
  } finally {
    redisClient.quit();
  }
};

module.exports.getETagValue = str => {
  return etag(str);
};
