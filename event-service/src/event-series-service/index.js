import * as eventSeriesRepository from "../persistence/event-series-repository";
import * as normaliser from "./normaliser";
import * as validator from "./validator";
import * as mapper from "./mapper";
import * as notifier from "../notifier";
import * as entityType from "../types/entity-type";
import * as eventRepository from "../persistence/event-repository";
import * as cacher from "../cacher";

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
  return { entity: eventSeries };
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
  const dbEventSeries = mapper.mapCreateOrUpdateEventSeriesRequest(params);
  await eventSeriesRepository.createOrUpdateEventSeries(dbEventSeries);
  if (isUpdate) {
    const eventIds = await eventRepository.getEventIdsByEventSeries(
      dbEventSeries.id
    );
    await Promise.all(eventIds.map(notifier.updateEvent));
  }
  await notifier.indexEntity(mapper.mapToPublicFullResponse(dbEventSeries));
  await cacher.clearEntityEtag(entityType.EVENT_SERIES, dbEventSeries.id);
  return { entity: dbEventSeries };
}

export async function getNextEventSeries(lastId) {
  const dbEventSeries = await eventSeriesRepository.getNextEventSeries(lastId);
  return dbEventSeries ? mapper.mapToPublicFullResponse(dbEventSeries) : null;
}
