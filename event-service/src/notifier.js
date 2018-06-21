import * as sns from "./external-services/sns";

const INDEX_DOCUMENT_TOPIC_ARN =
  process.env.SERVERLESS_INDEX_DOCUMENT_TOPIC_ARN;
const EVENT_UPDATED_TOPIC_ARN = process.env.SERVERLESS_EVENT_UPDATED_TOPIC_ARN;

export async function indexEntity(entity) {
  await sns.notify(
    { entityType: entity.entityType, entity },
    INDEX_DOCUMENT_TOPIC_ARN
  );
}

export async function updateEvent(eventId) {
  await sns.notify({ eventId }, EVENT_UPDATED_TOPIC_ARN);
}
