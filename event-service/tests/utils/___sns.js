import AWS from "aws-sdk";

const sns = new AWS.SNS({
  endpoint: "http://127.0.0.1:4002",
  region: "eu-west-1"
});

export async function subscribe(topicName, url) {
  const subscription = await sns
    .subscribe({
      TopicArn: `arn:aws:sns:eu-west-1:1111111111111:${topicName}-development`,
      Protocol: "http",
      Endpoint: url
    })
    .promise();

  return subscription;

  // await sns.confirmSubscription()
}

export async function unsubscribe(subscription) {
  await sns.unsubscribe(subscription).promise();
}
