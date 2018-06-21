import etag from "etag";
import * as redisClient from "./redis-client";

export async function storeEntityEtag(entityType, id, data) {
  const value = etag(data);
  await redisClient.set(createKeyForEntity(entityType, id), value);
  return value;
}

export async function getEntityEtag(entityType, id) {
  return await redisClient.get(createKeyForEntity(entityType, id));
}

export async function clearEntityEtag(entityType, id) {
  return await redisClient.set(createKeyForEntity(entityType, id), "");
}

function createKeyForEntity(entityType, id) {
  return `${process.env.SERVERLESS_STAGE}/${entityType}/${id}`;
}
