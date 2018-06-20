import * as eventRepository from "../persistence/event-repository";
import * as referencedEntitiesRepository from "../persistence/referenced-entities-repository";
import * as normaliser from "./normaliser";
import * as validator from "./validator";
import * as mapper from "./mapper";
import * as notifier from "../notifier";

export async function getEvent(params) {
  let event = await eventRepository.getEvent(params.id, false);
  const referencedEntities = await referencedEntitiesRepository.getReferencedEntities(
    event,
    false
  );
  event = mapper.mergeReferencedEntities(event, referencedEntities);
  return { entity: mapper.mapToPublicFullResponse(event) };
}

export async function getEventForEdit(params) {
  let event = await eventRepository.getEvent(params.id, true);
  const referencedEntities = await referencedEntitiesRepository.getReferencedEntities(
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
      const referencedEntities = await referencedEntitiesRepository.getReferencedEntities(
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
  const event = mapper.mapCreateOrUpdateEventRequest(params);
  await eventRepository.createOrUpdateEvent(event);
  await notifier.updateEvent(event.id);
  const referencedEntities = await referencedEntitiesRepository.getReferencedEntities(
    event,
    false
  );
  return { entity: mapper.mergeReferencedEntities(event, referencedEntities) };
}
