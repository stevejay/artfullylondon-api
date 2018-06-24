import * as eventRepository from "../persistence/event-repository";
import * as normaliser from "./normaliser";
import * as validator from "./validator";
import * as mapper from "./mapper";
import * as notifier from "../notifier";

export async function get(params) {
  let event = await eventRepository.get(params.id, false);
  const referencedEntities = await eventRepository.getReferencedEntities(
    event,
    false
  );
  event = mapper.mergeReferencedEntities(event, referencedEntities);
  return { entity: mapper.mapToPublicFullResponse(event) };
}

export async function getForEdit(params) {
  let event = await eventRepository.get(params.id, true);
  const referencedEntities = await eventRepository.getReferencedEntities(
    event,
    false
  );
  event = mapper.mergeReferencedEntities(event, referencedEntities);
  return { entity: event };
}

export async function getMulti(params) {
  let events = await eventRepository.getMulti(params.ids);

  events = await Promise.all(
    events.map(async event => {
      const referencedEntities = await eventRepository.getReferencedEntities(
        event,
        false
      );
      return mapper.mergeReferencedEntities(event, referencedEntities);
    })
  );

  return { entities: events.map(mapper.mapToPublicSummaryResponse) };
}

export async function createOrUpdate(params) {
  params = normaliser.normaliseCreateOrUpdateEventRequest(params);
  validator.validateCreateOrUpdateEventRequest(params);
  const referencedEntities = await eventRepository.getReferencedEntities(
    params,
    false
  );
  const dbEvent = mapper.mapCreateOrUpdateEventRequest(params);
  await eventRepository.createOrUpdate(dbEvent);
  await notifier.updateEvent(dbEvent.id);
  return {
    entity: mapper.mergeReferencedEntities(dbEvent, referencedEntities)
  };
}

export async function getNextId(lastId) {
  return await eventRepository.getNextId(lastId);
}
