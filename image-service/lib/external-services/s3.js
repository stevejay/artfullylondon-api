'use strict';

const AWS = require('aws-sdk');
const fs = require('fs');

exports.getObjectFromS3 = (bucket, key, filePath) =>
  new AWS.S3().getObject({ Bucket: bucket, Key: key }).promise().then(
    data =>
      new Promise((resolve, reject) => {
        fs.writeFile(
          filePath,
          data.Body,
          err => (err ? reject(err) : resolve())
        );
      })
  );

exports.putObjectToS3 = object =>
  new AWS.S3().putObject(object).promise();
