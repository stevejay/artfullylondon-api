import _ from "lodash";
import * as entityRepository from "./entity-repository";
import dynamodb from "./dynamodb";
import { TALENT_TABLE_NAME } from "./talent-repository";
import { EVENT_SERIES_TABLE_NAME } from "./event-series-repository";
import { VENUE_TABLE_NAME } from "./venue-repository";

export const EVENT_TABLE_NAME = process.env.SERVERLESS_EVENT_TABLE_NAME;

export async function tryGet(id, consistentRead) {
  return await entityRepository.tryGet(EVENT_TABLE_NAME, id, consistentRead);
}

export async function get(id, consistentRead) {
  return await entityRepository.get(EVENT_TABLE_NAME, id, consistentRead);
}

export async function getEventIdsByVenue(venueId) {
  const events = await dynamodb.query({
    TableName: EVENT_TABLE_NAME,
    IndexName: process.env.SERVERLESS_EVENT_BY_VENUE_INDEX_NAME,
    KeyConditionExpression: "venueId = :id",
    ExpressionAttributeValues: { ":id": venueId },
    ProjectionExpression: "id"
  });

  return events.map(event => event.id);
}

export async function getEventIdsByEventSeries(eventSeriesId) {
  const events = await dynamodb.query({
    TableName: EVENT_TABLE_NAME,
    IndexName: process.env.SERVERLESS_EVENT_BY_EVENT_SERIES_INDEX_NAME,
    KeyConditionExpression: "eventSeriesId = :id",
    ExpressionAttributeValues: { ":id": eventSeriesId },
    ProjectionExpression: "id"
  });

  return events.map(event => event.id);
}

export async function createOrUpdate(event) {
  await entityRepository.write(EVENT_TABLE_NAME, event);
}

export function getReferencedEntities(event, consistentRead, options) {
  return getReferencedEntitiesImpl(
    options.fetchVenue ? event.venueId : null,
    options.fetchEventSeries ? event.eventSeriesId : null,
    options.fetchTalents
      ? (event.talents || []).map(talent => talent.id)
      : null,
    consistentRead
  );
}

async function getReferencedEntitiesImpl(
  venueId,
  eventSeriesId,
  talentIds,
  consistentRead
) {
  if (!venueId && !eventSeriesId && _.isEmpty(talentIds)) {
    return null;
  }

  const params = {
    RequestItems: {}
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
  const eventSeries = response.Responses[EVENT_SERIES_TABLE_NAME];
  const venue = response.Responses[VENUE_TABLE_NAME];

  const result = {
    talents: response.Responses[TALENT_TABLE_NAME] || [],
    eventSeries: _.isEmpty(eventSeries) ? null : eventSeries[0],
    venue: _.isEmpty(venue) ? null : venue[0]
  };

  if (venueId && _.isNil(result.venue)) {
    throw new Error(`[404] Referenced venue ${venueId} not found`);
  }

  if (eventSeriesId && _.isNil(result.eventSeries)) {
    throw new Error(`[404] Referenced event series ${eventSeriesId} not found`);
  }

  if (!_.isEmpty(talentIds) && result.talents.length !== talentIds.length) {
    throw new Error(
      `[404] One or more referenced talents ${talentIds.join(";")} not found`
    );
  }

  return result;
}

export async function getNextId(lastId) {
  return await entityRepository.getNextEntityId(EVENT_TABLE_NAME, lastId);
}
