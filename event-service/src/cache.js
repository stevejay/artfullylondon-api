import etag from "etag";
import * as redisClient from "./external-services/redis";

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

// TODO add stage to key!

export function createKeyForEntity(entityType, id) {
  return `${entityType}/${id}`;
}
