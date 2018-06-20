import etag from "etag";
import * as redisClient from "./external-services/redis";

export async function storeEntityEtag(entity) {
  if (process.env.IS_OFFLINE) {
    return;
  }

  await redisClient.set(
    `${entity.entityType}/${entity.id}`,
    etag(JSON.stringify(entity))
  );
}

export async function getEntityEtag(entityType, id) {
  if (process.env.IS_OFFLINE) {
    return;
  }

  return await redisClient.get(`${entityType}/${id}`);
}
