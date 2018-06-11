"use strict";

const constants = require("../constants");

exports.findEvents = async function(externalEventIds) {
  const results = await request({
    uri: `${
      process.env.SEARCH_SERVICE_HOST
    }/admin/search/preset/events-by-external-ids?id=${externalEventIds.join(
      ","
    )}`,
    json: true,
    method: "GET",
    timeout: 30000
  });

  return results.items;
};
