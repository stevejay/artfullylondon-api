import * as snsClient from "./sns-client";

const INDEX_DOCUMENT_TOPIC_ARN =
  process.env.SERVERLESS_INDEX_DOCUMENT_TOPIC_ARN;
const EVENT_UPDATED_TOPIC_ARN = process.env.SERVERLESS_EVENT_UPDATED_TOPIC_ARN;
const REFRESH_SEARCH_INDEX_TOPIC_ARN =
  process.env.SERVERLESS_REFRESH_SEARCH_INDEX_TOPIC_ARN;

export async function indexEntity(entity) {
  if (!entity || !entity.entityType) {
    throw new Error("notifier:indexEntity - invalid entity");
  }

  await snsClient.notify(
    { entityType: entity.entityType, entity },
    INDEX_DOCUMENT_TOPIC_ARN
  );
}

export async function updateEvent(eventId) {
  if (!eventId) {
    throw new Error("notifier:updateEvent - invalid eventId");
  }

  await snsClient.notify({ eventId }, EVENT_UPDATED_TOPIC_ARN);
}

export async function searchIndexRefresh(
  actionId,
  iterationId,
  entityType,
  lastId = null
) {
  if (!actionId || !iterationId || !entityType) {
    throw new Error("notifier:searchIndexRefresh - invalid args");
  }

  await snsClient.notify(
    {
      actionId,
      iterationId,
      entityType,
      lastId,
      retry: 0
    },
    REFRESH_SEARCH_INDEX_TOPIC_ARN
  );
}
