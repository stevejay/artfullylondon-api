"use strict";

const AWS = require("aws-sdk");

exports.invoke = async function(functionName, payload) {
  const result = await new AWS.Lambda()
    .invoke({
      FunctionName: functionName,
      Payload: JSON.stringify(payload)
    })
    .promise();

  if (!result || result.StatusCode !== 200) {
    throw new Error(`${functionName} failed: ${JSON.stringify(result)}`);
  } else {
    const payload = JSON.parse(result.Payload);

    if (payload.errorMessage) {
      throw new Error(payload.errorMessage);
    } else {
      return payload;
    }
  }
};
