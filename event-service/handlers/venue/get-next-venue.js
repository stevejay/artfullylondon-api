'use strict';

const venueService = require('../../lib/venue/venue-service');

module.exports.handler = (event, context, cb) => {
  venueService
    .getNextVenue(event.lastId)
    .then(result =>
      cb(null, { venueId: result.Items.length ? result.Items[0].id : null }))
    .catch(cb);
};
