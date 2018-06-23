import * as venueRepository from "../persistence/venue-repository";
import * as normaliser from "./normaliser";
import * as validator from "./validator";
import * as mapper from "./mapper";
import * as enhancer from "../enhancer";
import * as entityType from "../types/entity-type";
import * as eventRepository from "../persistence/event-repository";
import * as notifier from "../notifier";
import * as cacher from "../cacher";

export async function getVenue(params) {
  const venue = await venueRepository.getVenue(params.id, false);
  return { entity: mapper.mapToPublicFullResponse(venue) };
}

export async function getVenueForEdit(params) {
  const venue = await venueRepository.getVenue(params.id, true);
  return { entity: mapper.mapToAdminResponse(venue) };
}

export async function getVenueMulti(params) {
  const venues = await venueRepository.getVenueMulti(params.ids);
  return { entities: venues.map(mapper.mapToPublicSummaryResponse) };
}

export async function createOrUpdateVenue(params) {
  params = normaliser.normaliseCreateOrUpdateVenueRequest(params);
  validator.validateCreateOrUpdateVenueRequest(params);
  params = await enhancer.enhanceDescription(params);
  const isUpdate = !!params.id;
  const dbVenue = mapper.mapCreateOrUpdateVenueRequest(params);
  await venueRepository.createOrUpdateVenue(dbVenue);
  if (isUpdate) {
    const eventIds = await eventRepository.getEventIdsByVenue(dbVenue.id);
    await Promise.all(eventIds.map(notifier.updateEvent));
  }
  await notifier.indexEntity(mapper.mapToPublicFullResponse(dbVenue));
  await cacher.clearEntityEtag(entityType.VENUE, dbVenue.id);
  return { entity: dbVenue };
}

export async function getNextVenue(lastId) {
  const dbVenue = await venueRepository.getNextVenue(lastId);
  return dbVenue ? mapper.mapToPublicFullResponse(dbVenue) : null;
}
