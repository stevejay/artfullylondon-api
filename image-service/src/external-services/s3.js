"use strict";

const AWS = require("aws-sdk");
const fs = require("fs");

exports.getObjectFromS3 = async (bucket, key, filePath) => {
  const data = await new AWS.S3()
    .getObject({ Bucket: bucket, Key: key })
    .promise();

  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data.Body, err => (err ? reject(err) : resolve()));
  });
};

exports.putObjectToS3 = object => new AWS.S3().putObject(object).promise();
