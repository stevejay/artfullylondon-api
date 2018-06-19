import etag from "etag";
import * as log from "loglevel";

// TODO fix this file

export async function tryGetETagFromRedis(key) {
  if (process.env.IS_OFFLINE) {
    return null;
  }

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
}

export async function writeETagToRedis(key, objStr) {
  if (process.env.IS_OFFLINE) {
    return;
  }

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
}

export function getETagValue(str) {
  return etag(str);
}
