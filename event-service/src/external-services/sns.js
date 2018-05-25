"use strict";

const AWS = require("aws-sdk");

const config = process.env.IS_OFFLINE
  ? {
      endpoint: "http://localhost:4002",
      region: "eu-west-1"
    }
  : undefined;

const sns = new AWS.SNS(config);

exports.notify = async (body, headers) => {
  console.log("notifying >>>", body, headers);

  await sns
    .publish({
      Message: JSON.stringify(body),
      MessageStructure: "json",
      TopicArn: headers.arn
    })
    .promise();
};
