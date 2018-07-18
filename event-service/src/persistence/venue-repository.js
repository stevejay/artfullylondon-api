import * as entityRepository from "./entity-repository";

export const VENUE_TABLE_NAME = process.env.SERVERLESS_VENUE_TABLE_NAME;

export async function tryGet(id, consistentRead) {
  return await entityRepository.tryGet(VENUE_TABLE_NAME, id, consistentRead);
}

export async function createOrUpdate(venue) {
  await entityRepository.write(VENUE_TABLE_NAME, venue);
}

export async function getNextId(lastId) {
  return await entityRepository.getNextEntityId(VENUE_TABLE_NAME, lastId);
}
