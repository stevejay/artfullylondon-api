import * as sns from "./external-services/sns";

const INDEX_DOCUMENT_TOPIC = {
  arn: process.env.SERVERLESS_INDEX_DOCUMENT_TOPIC_ARN
};

export async function indexEntity(entity) {
  await sns.notify(
    { entityType: entity.entityType, entity },
    INDEX_DOCUMENT_TOPIC
  );
}
