import AWS from "aws-sdk";

const sns = new AWS.SNS({
  endpoint: "http://127.0.0.1:4002",
  region: "eu-west-1"
});

export function send(topicName, message) {
  return new Promise((resolve, reject) => {
    sns.publish(
      {
        Message: JSON.stringify(message),
        TopicArn: `arn:aws:sns:eu-west-1:1111111111111:${topicName}-development`
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
}
