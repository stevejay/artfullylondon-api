import * as eventSeriesRepository from "../persistence/event-series-repository";
import * as normaliser from "./normaliser";
import * as validator from "./validator";
import * as mapper from "./mapper";
import * as notifier from "../notifier";
import * as eventRepository from "../persistence/event-repository";
import * as entityType from "../types/entity-type";

export async function get(params) {
  const dbEventSeries = await eventSeriesRepository.tryGet(params.id, false);
  return dbEventSeries ? mapper.mapResponse(dbEventSeries) : null;
}

export async function getForEdit(params) {
  return await eventSeriesRepository.tryGet(params.id, true);
}

export async function createOrUpdate(params) {
  const eventSeries = normaliser.normaliseCreateOrUpdateEventSeriesRequest(
    params
  );
  validator.validateCreateOrUpdateEventSeriesRequest(eventSeries);
  const isUpdate = !!eventSeries.id;
  const dbEventSeries = mapper.mapCreateOrUpdateEventSeriesRequest(eventSeries);
  await eventSeriesRepository.createOrUpdate(dbEventSeries);
  if (isUpdate) {
    const eventIds = await eventRepository.getEventIdsByEventSeries(
      dbEventSeries.id
    );
    await Promise.all(eventIds.map(notifier.updateEvent));
  }
  const response = mapper.mapResponse(dbEventSeries);
  await notifier.indexEntity(response, entityType.EVENT_SERIES);
  return response;
}

export async function getNextId(lastId) {
  return await eventSeriesRepository.getNextId(lastId);
}
