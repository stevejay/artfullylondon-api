'use strict';

const co = require('co');
const request = require('request-promise-lite');

const SEARCH_PRESET_URL =
  'https://api.artfully.london/search-service/admin/search/preset/by-external-event-id';

exports.findEvents = co.wrap(function*(venueId, externalEventIds) {
  if (!externalEventIds || externalEventIds.length === 0) {
    return [];
  }

  const url =
    SEARCH_PRESET_URL + '?id=' + encodeURIComponent(externalEventIds.join(','));

  const result = yield request.get(url, { json: true }).then(body => body);

  const matchesLookup = {};
  result.items.forEach(item => (matchesLookup[item.externalEventId] = item.id));

  const eventList = externalEventIds.map(
    externalEventId => matchesLookup[externalEventId] || null
  );

  return eventList;
});
