import * as notifier from "../notifier";
import * as eventRepository from "../persistence/event-repository";
import * as iterationLogRepository from "../persistence/iteration-log-repository";
import * as eventMapper from "../event-service/mapper";
import * as entityType from "../types/entity-type";
import * as cacher from "../cacher";
import * as validator from "./validator";
import iterationThrottler from "./iteration-throttler";
import * as venueService from "../venue-service";
import * as talentService from "../talent-service";
import * as eventService from "../event-service";
import * as eventSeriesService from "../event-series-service";

export async function updateEventSearchIndex(message) {
  if (!message || !message.eventId) {
    return;
  }
  let dbEvent = await eventRepository.getEvent(message.eventId, true);
  const referencedEntities = await eventRepository.getReferencedEntities(
    dbEvent,
    true
  );
  dbEvent = eventMapper.mergeReferencedEntities(dbEvent, referencedEntities);
  await notifier.indexEntity(eventMapper.mapToPublicFullResponse(dbEvent));
  await cacher.clearEntityEtag(entityType.EVENT, dbEvent.id);
}

export async function refreshSearchIndex(params) {
  validator.validateRefreshSearchIndexRequest(params);
  const actionId = `${params.entityType} refresh`;
  const iterationId = await iterationLogRepository.createLog(actionId);
  await notifier.searchIndexRefresh(actionId, iterationId, params.entityType);
  return { acknowledged: true };
}

// TODO improve error handling here:
export async function processRefreshSearchIndexMessage(message) {
  const startTime = process.hrtime();
  const nextEntity = await getNextEntity(message.entityType, message.lastId);
  if (nextEntity) {
    try {
      await notifier.indexEntity(nextEntity);
    } catch (err) {
      await iterationLogRepository.addErrorToLog(
        message.actionId,
        message.iterationId,
        `Error with ${message.entityType} entity ${nextEntity.id}: ${
          err.message
        }`
      );
    }
    await iterationThrottler(startTime, 500);
    await notifier.searchIndexRefresh(
      message.actionId,
      message.iterationId,
      message.entityType,
      nextEntity.id
    );
  } else {
    await iterationLogRepository.closeLog(
      message.actionId,
      message.iterationId
    );
  }
}

// TODO!!! eventMapper.mapToPublicFullResponse(nextEntity)

async function getNextEntity(type, lastId) {
  switch (type) {
    case entityType.EVENT:
      return await eventService.getNextEvent(lastId);
    case entityType.EVENT_SERIES:
      return await eventSeriesService.getNextEventSeries(lastId);
    case entityType.TALENT:
      return await talentService.getNextTalent(lastId);
    case entityType.VENUE:
      return await venueService.getNextVenue(lastId);
    default:
      throw new Error(`Unsupported entity type ${type}`);
  }
}
