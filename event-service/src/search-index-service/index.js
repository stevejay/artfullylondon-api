import * as log from "loglevel";
import * as notifier from "../notifier";
import * as eventRepository from "../persistence/event-repository";
import * as iterationLogRepository from "../persistence/iteration-log-repository";
import * as eventMapper from "../event-service/mapper";
import * as entityType from "../types/entity-type";
import * as cacher from "../cacher";
import * as validator from "./validator";
import iterationThrottler from "./iteration-throttler";
import * as serviceLookup from "./service-lookup";

export async function updateEventSearchIndex(message) {
  if (!message || !message.eventId) {
    return;
  }
  let dbEvent = await eventRepository.get(message.eventId, true);
  const referencedEntities = await eventRepository.getReferencedEntities(
    dbEvent,
    true
  );
  dbEvent = eventMapper.mergeReferencedEntities(dbEvent, referencedEntities);
  await notifier.indexEntity(
    eventMapper.mapResponse(dbEvent),
    entityType.EVENT
  );
  await cacher.clearEntityEtag(entityType.EVENT, dbEvent.id);
}

export async function refreshSearchIndex(params) {
  validator.validateRefreshSearchIndexRequest(params);
  const actionId = `${params.entityType} refresh`;
  const iterationId = await iterationLogRepository.createLog(actionId);
  await notifier.searchIndexRefresh(actionId, iterationId, params.entityType);
}

export async function processRefreshSearchIndexMessage(message) {
  const startTime = process.hrtime();
  const service = serviceLookup.getEntityServiceForType(message.entityType);
  const nextEntityId = await service.getNextId(message.lastId);
  if (nextEntityId) {
    try {
      const entity = await service.get({ id: nextEntityId });
      await notifier.indexEntity(entity, message.entityType);
    } catch (err) {
      log.error(`RefreshSearchIndex iteration error: ${err.message}`);
      await iterationLogRepository.addErrorToLog(
        message.actionId,
        message.iterationId,
        `Error with ${message.entityType} entity ${nextEntityId}: ${
          err.message
        }`
      );
    }
    await iterationThrottler(startTime, 500);
    await notifier.searchIndexRefresh(
      message.actionId,
      message.iterationId,
      message.entityType,
      nextEntityId
    );
  } else {
    await iterationLogRepository.closeLog(
      message.actionId,
      message.iterationId
    );
  }
}
