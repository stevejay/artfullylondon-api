import * as entityRepository from "./entity-repository";
import dynamodb from "./dynamodb";

export const VENUE_TABLE_NAME = process.env.SERVERLESS_VENUE_TABLE_NAME;

export async function get(id, consistentRead) {
  return await entityRepository.get(VENUE_TABLE_NAME, id, consistentRead);
}

export async function getMulti(ids) {
  const response = await dynamodb.batchGet({
    RequestItems: {
      [VENUE_TABLE_NAME]: {
        Keys: ids.map(id => ({ id })),
        ProjectionExpression:
          "id, #s, #n, venueType, address, postcode, latitude, longitude, images",
        ExpressionAttributeNames: {
          "#s": "status",
          "#n": "name"
        }
      }
    }
  });

  return response.Responses[VENUE_TABLE_NAME];
}

export async function createOrUpdate(venue) {
  await entityRepository.write(VENUE_TABLE_NAME, venue);
}

export async function getNextId(lastId) {
  return await entityRepository.getNextEntityId(VENUE_TABLE_NAME, lastId);
}
