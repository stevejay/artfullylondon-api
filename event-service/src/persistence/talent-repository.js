import * as entityRepository from "./entity-repository";

export const TALENT_TABLE_NAME = process.env.SERVERLESS_TALENT_TABLE_NAME;

export async function tryGet(id, consistentRead) {
  return await entityRepository.tryGet(TALENT_TABLE_NAME, id, consistentRead);
}

export async function createOrUpdate(talent) {
  await entityRepository.write(TALENT_TABLE_NAME, talent);
}

export async function getNextId(lastId) {
  return await entityRepository.getNextEntityId(TALENT_TABLE_NAME, lastId);
}
