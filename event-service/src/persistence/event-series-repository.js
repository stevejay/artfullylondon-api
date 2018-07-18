import * as entityRepository from "./entity-repository";

export const EVENT_SERIES_TABLE_NAME =
  process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME;

export async function tryGet(id, consistentRead) {
  return await entityRepository.tryGet(
    EVENT_SERIES_TABLE_NAME,
    id,
    consistentRead
  );
}

export async function createOrUpdate(eventSeries) {
  await entityRepository.write(EVENT_SERIES_TABLE_NAME, eventSeries);
}

export async function getNextId(lastId) {
  return await entityRepository.getNextEntityId(
    EVENT_SERIES_TABLE_NAME,
    lastId
  );
}
