import _ from "lodash";
import * as dynamodb from "./dynamodb";
import { TALENT_TABLE_NAME } from "./talent-repository";
import { EVENT_SERIES_TABLE_NAME } from "./event-series-repository";
import { VENUE_TABLE_NAME } from "./venue-repository";

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
