"use strict";

const venueService = require("../../venue/venue-service");

exports.handler = (event, context, cb) => {
  venueService
    .getNextVenue(event.lastId)
    .then(result =>
      cb(null, { venueId: result.Items.length ? result.Items[0].id : null })
    )
    .catch(cb);
};
