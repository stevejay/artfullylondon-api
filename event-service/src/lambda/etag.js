"use strict";

const etag = require("etag");
const log = require("loglevel");

exports.tryGetETagFromRedis = async function(key) {
  const redisClient = require("../external-services/redis")();

  try {
    redisClient.waitForReady();
    return await redisClient.get(key);
  } catch (err) {
    log.error("error when querying redis: " + err.message);
    return null;
  } finally {
    redisClient.quit();
  }
};

exports.writeETagToRedis = async function(key, objStr) {
  const redisClient = require("../external-services/redis")();

  try {
    redisClient.waitForReady();
    const value = etag(objStr);
    await redisClient.set(key, value);
  } catch (err) {
    log.error("error when writing to redis: " + err.message);
  } finally {
    redisClient.quit();
  }
};

exports.getETagValue = str => etag(str);
