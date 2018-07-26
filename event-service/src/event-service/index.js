import * as eventRepository from "../persistence/event-repository";
import * as normaliser from "./normaliser";
import * as validator from "./validator";
import * as mapper from "./mapper";
import * as notifier from "../notifier";

export async function get(params, options) {
  const dbEvent = await getImpl(params, options, false);
  return dbEvent ? mapper.mapResponse(dbEvent) : null;
}

export async function getForEdit(params, options) {
  return await getImpl(params, options, true);
}

async function getImpl(params, options, consistentRead) {
  let dbEvent = await eventRepository.tryGet(params.id, consistentRead);
  if (!dbEvent) {
    return null;
  }
  const referencedEntities = await eventRepository.getReferencedEntities(
    dbEvent,
    consistentRead,
    options
  );
  return mapper.mergeReferencedEntities(dbEvent, referencedEntities);
}

export async function createOrUpdate(params) {
  const event = normaliser.normaliseCreateOrUpdateEventRequest(params);
  validator.validateCreateOrUpdateEventRequest(event);
  let dbEvent = mapper.mapCreateOrUpdateEventRequest(event);
  await eventRepository.createOrUpdate(dbEvent);
  await notifier.updateEvent(dbEvent.id);
  const referencedEntities = await eventRepository.getReferencedEntities(
    dbEvent,
    false,
    { fetchVenue: true, fetchEventSeries: true, fetchTalents: true }
  );
  dbEvent = mapper.mergeReferencedEntities(dbEvent, referencedEntities);
  return mapper.mapResponse(dbEvent);
}

export async function getNextId(lastId) {
  return await eventRepository.getNextId(lastId);
}
