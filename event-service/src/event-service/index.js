import * as eventRepository from "../persister/event-repository";
import * as normaliser from "./normaliser";
import * as validator from "./validator";
import * as mapper from "./mapper";
import * as notifier from "../notifier";

export async function getEvent(params) {
  let event = await eventRepository.getEvent(params.id, false);
  const referencedEntities = await eventRepository.getReferencedEntities(
    event,
    false
  );
  event = mapper.mergeReferencedEntities(event, referencedEntities);
  return { entity: mapper.mapToPublicFullResponse(event) };
}

export async function getEventForEdit(params) {
  let event = await eventRepository.getEvent(params.id, true);
  const referencedEntities = await eventRepository.getReferencedEntities(
    event,
    false
  );
  event = mapper.mergeReferencedEntities(event, referencedEntities);
  return { entity: event };
}

export async function getEventMulti(params) {
  let events = await eventRepository.getEventMulti(params.ids);

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

export async function createOrUpdateEvent(params) {
  params = normaliser.normaliseCreateOrUpdateEventRequest(params);
  validator.validateCreateOrUpdateEventRequest(params);
  const dbEvent = mapper.mapCreateOrUpdateEventRequest(params);
  await eventRepository.createOrUpdateEvent(dbEvent);
  await notifier.updateEvent(dbEvent.id);
  const referencedEntities = await eventRepository.getReferencedEntities(
    dbEvent,
    false
  );
  return {
    entity: mapper.mergeReferencedEntities(dbEvent, referencedEntities)
  };
}
