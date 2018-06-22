import AWS from "aws-sdk";
import * as fsWrapper from "../library-wrappers/fs-wrapper";

const config =
  process.env.IS_OFFLINE || process.env.NODE_ENV === "test"
    ? { endpoint: "http://localhost:4572", s3ForcePathStyle: true }
    : undefined;

const s3 = new AWS.S3(config);

export async function getObjectFromS3(bucket, key, filePath) {
  const data = await s3.getObject({ Bucket: bucket, Key: key }).promise();
  await fsWrapper.writeFile(filePath, data.Body);
}

export async function putObjectToS3(bucket, key, mimeType, content) {
  await s3
    .putObject({
      Bucket: bucket,
      Key: key,
      Body: content,
      ContentType: mimeType
    })
    .promise();
}
