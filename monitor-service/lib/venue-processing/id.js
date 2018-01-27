'use strict';

module.exports.createExternalEventId = function(venueId, eventUrl) {
  const normalisedEventUrl =
    (eventUrl || '').replace(/^https?:\/\/[^/]+/i, '').toLowerCase() || '/';

  return venueId + '|' + normalisedEventUrl;
};
