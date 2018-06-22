import dynamodb from "./dynamodb";

const BASIC_REQUEST = {
  TableName: process.env.SERVERLESS_IMAGE_TABLE_NAME,
  ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
};

export async function getImage(imageId) {
  return await dynamodb.get({ ...BASIC_REQUEST, Key: { id: imageId } });
}

export async function validateDoesNotExist(imageId) {
  const image = await dynamodb.tryGet({
    ...BASIC_REQUEST,
    Key: { id: imageId }
  });

  if (image) {
    throw new Error("[400] Image Already Exists");
  }
}

export async function getNextImage(lastImageId) {
  const result = await dynamodb.scanBasic({
    ...BASIC_REQUEST,
    ExclusiveStartKey: lastImageId || null,
    Limit: 1,
    ProjectionExpression: "id",
    ConsistentRead: false
  });

  return result.Items.length > 0 ? result.Items[0] : null;
}

export function createImage(image) {
  return dynamodb.put({
    ...BASIC_REQUEST,
    Item: image,
    ConditionExpression: "attribute_not_exists(id)"
  });
}

export function updateImage(image) {
  return dynamodb.put({
    ...BASIC_REQUEST,
    Item: image,
    ConditionExpression: "attribute_exists(id)"
  });
}
