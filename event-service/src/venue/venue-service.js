import * as venueRepository from "../persistence/venue-repository";
import * as entityType from "../types/entity-type";
import * as normaliser from "./normaliser";
import * as validator from "./validator";
import * as mapper from "./mapper";
import * as entityEnhancer from "../entity/enhancer";
import * as indexer from "../indexer";
// const etag = require("../lambda/etag");

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
  params = normaliser.normaliseCreateVenueRequest(params);
  validator.validateCreateVenueRequest(params);
  params = entityEnhancer.addDescriptionFromWikipedia(params);
  const isUpdate = !!params.id;
  const venue = mapper.mapCreateOrUpdateVenueRequest(params);
  await venueRepository.createOrUpdateVenue(venue);
  if (isUpdate) {
    await eventMessaging.notifyEventsForVenue(venue.id);
  }
  await indexer.indexEntity(venue);
  // const publicResponse = mapper.mapToPublicFullResponse(venue);
  // await etag.writeETagToRedis(
  //   "venue/" + dbItem.id,
  //   JSON.stringify({ entity: publicResponse })
  // );
  return { entity: venue };
}
