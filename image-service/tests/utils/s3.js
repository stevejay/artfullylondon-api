import AWS from "aws-sdk";
import * as fs from "fs";

const s3 = new AWS.S3({
  endpoint: "http://localhost:4572",
  s3ForcePathStyle: true
});

export async function createBucket(bucketName) {
  await s3.createBucket({ Bucket: bucketName }).promise();
}

export async function deleteBucket(bucketName) {
  await s3.deleteBucket({ Bucket: bucketName }).promise();
}

export async function downloadFileFromS3(bucket, key, filePath) {
  const data = await s3.getObject({ Bucket: bucket, Key: key }).promise();
  fs.writeFileSync(filePath, data.Body);
}
