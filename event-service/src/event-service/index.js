import * as eventRepository from "../persistence/event-repository";
import * as normaliser from "./normaliser";
import * as validator from "./validator";
import * as mapper from "./mapper";
import * as notifier from "../notifier";

export async function get(params) {
  let dbEvent = await eventRepository.get(params.id, false);
  const referencedEntities = await eventRepository.getReferencedEntities(
    dbEvent,
    false
  );
  dbEvent = mapper.mergeReferencedEntities(dbEvent, referencedEntities);
  return mapper.mapResponse(dbEvent);
}

export async function getForEdit(params) {
  return await eventRepository.get(params.id, true);
}

export async function createOrUpdate(params) {
  const event = normaliser.normaliseCreateOrUpdateEventRequest(params);
  validator.validateCreateOrUpdateEventRequest(event);
  let dbEvent = mapper.mapCreateOrUpdateEventRequest(event);
  await eventRepository.createOrUpdate(dbEvent);
  await notifier.updateEvent(dbEvent.id);
  const referencedEntities = await eventRepository.getReferencedEntities(
    dbEvent,
    false
  );
  dbEvent = mapper.mergeReferencedEntities(dbEvent, referencedEntities);
  return mapper.mapResponse(dbEvent);
}

export async function getNextId(lastId) {
  return await eventRepository.getNextId(lastId);
}
