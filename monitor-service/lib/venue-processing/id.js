'use strict';

exports.createExternalEventId = function(venueId, eventUrl) {
  const normalisedEventUrl =
    (eventUrl || '').replace(/^https?:\/\/[^/]+/i, '').toLowerCase() || '/';

  return venueId + '|' + normalisedEventUrl;
};
