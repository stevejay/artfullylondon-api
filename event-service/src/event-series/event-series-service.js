import * as eventSeriesRepository from "../persistence/event-series-repository";
import * as entityType from "../types/entity-type";
import * as normaliser from "./normaliser";
import * as validator from "./validator";
import * as mapper from "./mapper";
import * as indexer from "../indexer";
// const etag = require("../lambda/etag");

export async function getEventSeries(params) {
  const eventSeries = await eventSeriesRepository.getEventSeries(
    params.id,
    false
  );
  return { entity: mapper.mapToPublicFullResponse(eventSeries) };
}

export async function getEventSeriesForEdit(params) {
  const eventSeries = await eventSeriesRepository.getEventSeries(
    params.id,
    true
  );
  return { entity: mapper.mapToAdminResponse(eventSeries) };
}

export async function getEventSeriesMulti(params) {
  const eventSeries = await eventSeriesRepository.getEventSeriesMulti(
    params.ids
  );
  return { entities: eventSeries.map(mapper.mapToPublicSummaryResponse) };
}

export async function createOrUpdateEventSeries(params) {
  params = normaliser.normaliseCreateOrUpdateEventSeriesRequest(params);
  validator.validateCreateOrUpdateEventSeriesRequest(params);
  const isUpdate = !!params.id;
  const eventSeries = mapper.mapCreateOrUpdateEventSeriesRequest(params);
  await eventSeriesRepository.createOrUpdateEventSeries(eventSeries);
  if (isUpdate) {
    await eventMessaging.notifyEventsForEventSeries(dbItem.id);
  }
  await indexer.indexEntity(eventSeries);
  // const publicResponse = mapper.mapToPublicFullResponse(eventSeries);
  // await etag.writeETagToRedis(
  //   "event-series/" + dbItem.id,
  //   JSON.stringify({ entity: publicResponse })
  // );
  return { entity: eventSeries };
}
