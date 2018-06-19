import AWS from "aws-sdk";

const config = process.env.IS_OFFLINE
  ? {
      endpoint: "http://localhost:4002",
      region: "eu-west-1"
    }
  : undefined;

const sns = new AWS.SNS(config);

export function notify(body, headers) {
  return sns
    .publish({
      Message: JSON.stringify(body),
      MessageStructure: "json",
      TopicArn: headers.arn
    })
    .promise();
}
