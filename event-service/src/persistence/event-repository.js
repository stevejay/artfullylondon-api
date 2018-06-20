import * as entityRepository from "./entity-repository";
import * as talentRepository from "./talent-repository";
import * as venueRepository from "./venue-repository";
import * as eventSeriesRepository from "./event-series-repository";
import * as dynamodb from "./dynamodb";

export const EVENT_TABLE_NAME = process.env.SERVERLESS_EVENT_TABLE_NAME;

export async function getEvent(id, consistentRead) {
  return await entityRepository.get(EVENT_TABLE_NAME, id, consistentRead);
}

export async function getEventMulti(ids) {
  const response = await dynamodb.batchGet({
    RequestItems: {
      [EVENT_TABLE_NAME]: {
        Keys: ids.map(id => ({ id })),
        ProjectionExpression:
          "id, #s, #n, eventType, occurrenceType, " +
          "costType, dateFrom, dateTo, summary, " +
          "performancesOverrides, images, venueId",
        ExpressionAttributeNames: { "#n": "name", "#s": "status" }
      }
    },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });

  return response.Responses[EVENT_TABLE_NAME];
}

export async function getEventIdsByVenue(venueId) {
  const events = await dynamodb.query({
    TableName: EVENT_TABLE_NAME,
    IndexName: process.env.SERVERLESS_EVENT_BY_VENUE_INDEX_NAME,
    KeyConditionExpression: "venueId = :id",
    ExpressionAttributeValues: { ":id": venueId },
    ProjectionExpression: "id",
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });

  return events.map(event => event.id);
}

export async function getEventIdsByEventSeries(eventSeriesId) {
  const events = await dynamodb.query({
    TableName: EVENT_TABLE_NAME,
    IndexName: process.env.SERVERLESS_EVENT_BY_EVENT_SERIES_INDEX_NAME,
    KeyConditionExpression: "eventSeriesId = :id",
    ExpressionAttributeValues: { ":id": eventSeriesId },
    ProjectionExpression: "id",
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });

  return events.map(event => event.id);
}

export async function createOrUpdateEvent(event) {
  await entityRepository.write(EVENT_TABLE_NAME, event);
}

export async function getReferencedEntities(event, consistentRead) {
  const params = {
    RequestItems: {},
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  };

  if (event.talents && event.talents.length) {
    params.RequestItems[talentRepository.TALENT_TABLE_NAME] = {
      Keys: event.talents.map(talent => ({ id: talent.id })),
      ConsistentRead: consistentRead
    };
  }

  if (event.eventSeriesId) {
    params.RequestItems[eventSeriesRepository.EVENT_SERIES_TABLE_NAME] = {
      Keys: [{ id: event.eventSeriesId }],
      ConsistentRead: consistentRead
    };
  }

  params.RequestItems[venueRepository.VENUE_TABLE_NAME] = {
    Keys: [{ id: event.venueId }],
    ConsistentRead: consistentRead
  };

  const response = await dynamodb.batchGet(params);

  return {
    talents: response.Responses[talentRepository.TALENT_TABLE_NAME] || [],
    eventSeries:
      response.Responses[eventSeriesRepository.EVENT_SERIES_TABLE_NAME] || [],
    venue: response.Responses[venueRepository.VENUE_TABLE_NAME] || []
  };
}
