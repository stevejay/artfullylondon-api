import _ from "lodash";
import * as entityRepository from "./entity-repository";
import dynamodb from "./dynamodb";
import { TALENT_TABLE_NAME } from "./talent-repository";
import { EVENT_SERIES_TABLE_NAME } from "./event-series-repository";
import { VENUE_TABLE_NAME } from "./venue-repository";

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

export function getReferencedEntities(event, consistentRead) {
  return getReferencedEntitiesImpl(
    event.venueId,
    event.eventSeriesId,
    event.talents.map(talent => talent.id),
    consistentRead
  );
}

async function getReferencedEntitiesImpl(
  venueId,
  eventSeriesId,
  talentIds,
  consistentRead
) {
  const params = {
    RequestItems: {},
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  };

  if (!_.isEmpty(talentIds)) {
    params.RequestItems[TALENT_TABLE_NAME] = {
      Keys: talentIds.map(id => ({ id })),
      ConsistentRead: !!consistentRead
    };
  }

  if (eventSeriesId) {
    params.RequestItems[EVENT_SERIES_TABLE_NAME] = {
      Keys: [{ id: eventSeriesId }],
      ConsistentRead: !!consistentRead
    };
  }

  if (venueId) {
    params.RequestItems[VENUE_TABLE_NAME] = {
      Keys: [{ id: venueId }],
      ConsistentRead: !!consistentRead
    };
  }

  const response = await dynamodb.batchGet(params);
  const eventSeries = response.Responses[process.EVENT_SERIES_TABLE_NAME];
  const venue = response.Responses[process.VENUE_TABLE_NAME];

  return {
    talents: response.Responses[TALENT_TABLE_NAME] || [],
    eventSeries: _.isEmpty(eventSeries) ? null : eventSeries[0],
    venue: _.isEmpty(venue) ? null : venue[0]
  };
}
