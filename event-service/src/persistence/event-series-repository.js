import * as entityRepository from "./entity-repository";
import * as dynamodb from "./dynamodb";

const EVENT_SERIES_TABLE_NAME = process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME;

export async function getEventSeries(id, consistentRead) {
  return await entityRepository.get(
    EVENT_SERIES_TABLE_NAME,
    id,
    consistentRead
  );
}

export async function getEventSeriesMulti(ids) {
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
    },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });

  return response.Responses[EVENT_SERIES_TABLE_NAME];
}

export async function createOrUpdateEventSeries(eventSeries) {
  await entityRepository.write(EVENT_SERIES_TABLE_NAME, eventSeries);
}
