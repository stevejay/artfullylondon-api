import * as entityRepository from "./entity-repository";
import * as dynamodb from "./dynamodb";

const VENUE_TABLE_NAME = process.env.SERVERLESS_VENUE_TABLE_NAME;

export async function getVenue(id, consistentRead) {
  return await entityRepository.get(VENUE_TABLE_NAME, id, consistentRead);
}

export async function getVenueMulti(ids) {
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
    },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });

  return response.Responses[VENUE_TABLE_NAME];
}

export async function getNextVenueId(lastId) {
  const result = await dynamodb.scanBasic({
    TableName: VENUE_TABLE_NAME,
    ExclusiveStartKey: lastId ? { id: lastId } : null,
    Limit: 1,
    ProjectionExpression: "id",
    ConsistentRead: false
  });

  return result.Items.length ? result.Items[0].id : null;
}

export async function createOrUpdateVenue(venue) {
  await entityRepository.write(VENUE_TABLE_NAME, venue);
}
