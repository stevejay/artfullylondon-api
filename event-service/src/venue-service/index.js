import * as venueRepository from "../persistence/venue-repository";
import * as normaliser from "./normaliser";
import * as validator from "./validator";
import * as mapper from "./mapper";
import * as enhancer from "../enhancer";
import * as eventRepository from "../persistence/event-repository";
import * as notifier from "../notifier";
import * as entityType from "../types/entity-type";

export async function get(params) {
  const dbVenue = await venueRepository.get(params.id, false);
  return mapper.mapResponse(dbVenue);
}

export async function getForEdit(params) {
  return await venueRepository.get(params.id, true);
}

export async function createOrUpdate(params) {
  let venue = normaliser.normaliseCreateOrUpdateVenueRequest(params);
  validator.validateCreateOrUpdateVenueRequest(venue);
  venue = await enhancer.enhanceDescription(venue);
  const isUpdate = !!venue.id;
  const dbVenue = mapper.mapCreateOrUpdateVenueRequest(venue);
  await venueRepository.createOrUpdate(dbVenue);
  if (isUpdate) {
    const eventIds = await eventRepository.getEventIdsByVenue(dbVenue.id);
    await Promise.all(eventIds.map(notifier.updateEvent));
  }
  const response = mapper.mapResponse(dbVenue);
  await notifier.indexEntity(response, entityType.VENUE);
  return response;
}

export async function getNextId(lastId) {
  return await venueRepository.getNextId(lastId);
}
