import * as eventSeriesRepository from "../persistence/event-series-repository";
import * as normaliser from "./normaliser";
import * as validator from "./validator";
import * as mapper from "./mapper";
import * as notifier from "../notifier";
import * as eventRepository from "../persistence/event-repository";

export async function get(params) {
  const dbEventSeries = await eventSeriesRepository.get(params.id, false);
  return mapper.mapResponse(dbEventSeries);
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
  await notifier.indexEntity(mapper.mapToPublicFullResponse(dbEventSeries));
  return mapper.mapResponse(dbEventSeries);
}

export async function getNextId(lastId) {
  return await eventSeriesRepository.getNextId(lastId);
}
