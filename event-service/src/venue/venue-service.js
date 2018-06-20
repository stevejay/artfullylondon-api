import * as venueRepository from "../persistence/venue-repository";
import * as normaliser from "./normaliser";
import * as validator from "./validator";
import * as mapper from "./mapper";
import * as entityEnhancer from "../entity/enhancer";
import * as eventRepository from "../persistence/event-repository";
import * as notifier from "../notifier";
import * as cache from "../cache";

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

export async function getNextVenueId(params) {
  const venueId = await venueRepository.getNextVenueId(params.lastId);
  return { venueId };
}

export async function createOrUpdateVenue(params) {
  params = normaliser.normaliseCreateOrUpdateVenueRequest(params);
  validator.validateCreateOrUpdateVenueRequest(params);
  params = entityEnhancer.addDescriptionFromWikipedia(params);
  const isUpdate = !!params.id;
  const dbVenue = mapper.mapCreateOrUpdateVenueRequest(params);
  await venueRepository.createOrUpdateVenue(dbVenue);
  if (isUpdate) {
    const eventIds = await eventRepository.getEventIdsByVenue(dbVenue.id);
    await Promise.all(eventIds.map(notifier.updateEvent));
  }
  const responseVenue = mapper.mapToPublicFullResponse(dbVenue);
  await notifier.indexEntity(responseVenue);
  await cache.storeEntityEtag(responseVenue);
  return { entity: dbVenue };
}
