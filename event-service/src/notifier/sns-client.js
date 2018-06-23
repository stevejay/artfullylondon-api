import AWS from "aws-sdk";

const config = process.env.IS_OFFLINE  || process.env.NODE_ENV === "test"
  ? {
      endpoint: "http://localhost:4002",
      region: "eu-west-1"
    }
  : undefined;

const sns = new AWS.SNS(config);

export function notify(body, topicArn) {
  return sns
    .publish({
      Message: JSON.stringify({ default: body }),
      MessageStructure: "json",
      TopicArn: topicArn
    })
    .promise();
}
