'use strict';

const uniq = require('lodash.uniq');
const dynamoDbClient = require('dynamodb-doc-client-wrapper');

module.exports.getReferencedEntities = function*(dbItem, options) {
  const consistentRead = !!options && !!options.ConsistentRead;

  const params = {
    RequestItems: {},
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  };

  if (dbItem.talents && dbItem.talents.length) {
    params.RequestItems[process.env.SERVERLESS_TALENT_TABLE_NAME] = {
      Keys: dbItem.talents.map(talent => ({ id: talent.id })),
      ConsistentRead: consistentRead
    };
  }

  if (dbItem.eventSeriesId) {
    params.RequestItems[process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME] = {
      Keys: [{ id: dbItem.eventSeriesId }],
      ConsistentRead: consistentRead
    };
  }

  params.RequestItems[process.env.SERVERLESS_VENUE_TABLE_NAME] = {
    Keys: [{ id: dbItem.venueId }],
    ConsistentRead: consistentRead
  };

  const response = yield dynamoDbClient.batchGet(params);

  return {
    talent: response.Responses[process.env.SERVERLESS_TALENT_TABLE_NAME] || [],
    eventSeries: response.Responses[
      process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME
    ] || [],
    venue: response.Responses[process.env.SERVERLESS_VENUE_TABLE_NAME] || []
  };
};

module.exports.getReferencedEntitiesForSearch = function*(dbItems, options) {
  const consistentRead = !!options && !!options.ConsistentRead;

  const params = {
    RequestItems: {},
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  };

  params.RequestItems[process.env.SERVERLESS_VENUE_TABLE_NAME] = {
    Keys: uniq(dbItems.map(event => event.venueId)).map(venueId => ({
      id: venueId
    })),
    ConsistentRead: consistentRead
  };

  const allEventSeriesIds = dbItems
    .filter(event => !!event.eventSeriesId)
    .map(event => event.eventSeriesId);

  if (allEventSeriesIds.length) {
    params.RequestItems[process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME] = {
      Keys: uniq(allEventSeriesIds).map(eventSeriesId => ({
        id: eventSeriesId
      })),
      ConsistentRead: consistentRead
    };
  }

  const response = yield dynamoDbClient.batchGet(params);
  const venuesLookup = _createLookup(
    response.Responses[process.env.SERVERLESS_VENUE_TABLE_NAME]
  );
  const eventSeriesLookup = _createLookup(
    response.Responses[process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME]
  );

  const result = dbItems.map(dbItem => ({
    entity: dbItem,
    referencedEntities: {
      venue: [venuesLookup[dbItem.venueId]],
      eventSeries: dbItem.eventSeriesId
        ? [eventSeriesLookup[dbItem.eventSeriesId]]
        : []
    }
  }));

  return result;
};

function _createLookup(entities) {
  const lookup = {};
  (entities || []).forEach(entity => lookup[entity.id] = entity);
  return lookup;
}
