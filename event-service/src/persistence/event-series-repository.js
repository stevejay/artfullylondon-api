import * as entityRepository from "./entity-repository";
import dynamodb from "./dynamodb";

export const EVENT_SERIES_TABLE_NAME =
  process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME;

export async function get(id, consistentRead) {
  return await entityRepository.get(
    EVENT_SERIES_TABLE_NAME,
    id,
    consistentRead
  );
}

export async function getMulti(ids) {
  const response = await dynamodb.batchGet({
    RequestItems: {
      [EVENT_SERIES_TABLE_NAME]: {
        Keys: ids.map(id => ({ id })),
        ProjectionExpression:
          "id, #s, #n, eventSeriesType, occurrence, summary, images",
        ExpressionAttributeNames: {
          "#s": "status",
          "#n": "name"
        }
      }
    }
  });

  return response.Responses[EVENT_SERIES_TABLE_NAME];
}

export async function createOrUpdate(eventSeries) {
  await entityRepository.write(EVENT_SERIES_TABLE_NAME, eventSeries);
}

export async function getNextId(lastId) {
  return await entityRepository.getNextEntityId(
    EVENT_SERIES_TABLE_NAME,
    lastId
  );
}
