'use strict';

const AWS = require('aws-sdk');

exports.invoke = function(functionName, payload) {
  return new Promise((resolve, reject) => {
    const lambda = new AWS.Lambda();

    const params = {
      FunctionName: functionName,
      Payload: JSON.stringify(payload),
    };

    lambda.invoke(params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        if (!result || result.StatusCode !== 200) {
          reject(
            new Error(`${functionName} failed: ${JSON.stringify(result)}`)
          );
        } else {
          const payload = JSON.parse(result.Payload);

          if (payload.errorMessage) {
            reject(new Error(payload.errorMessage));
          } else {
            resolve(payload);
          }
        }
      }
    });
  });
};
