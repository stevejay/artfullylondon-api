import AWS from "aws-sdk";

const config = process.env.IS_OFFLINE
  ? {
      endpoint: "http://localhost:4002",
      region: "eu-west-1"
    }
  : undefined;

const sns = new AWS.SNS(config);

export async function startReprocessingImages(iterationId) {
  const message = { iterationId, lastId: null, retry: 0 };
  await publishToReprocessImagesTopic(message);
}

export async function reprocessNextImage(iterationId, lastId) {
  const message = { iterationId, lastId, retry: 0 };
  await publishToReprocessImagesTopic(message);
}

async function publishToReprocessImagesTopic(message) {
  await sns
    .publish({
      Message: JSON.stringify({ default: message }),
      MessageStructure: "json",
      TopicArn: process.env.SERVERLESS_REPROCESS_IMAGES_TOPIC_ARN
    })
    .promise();
}
