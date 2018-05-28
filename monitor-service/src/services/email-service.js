"use strict";

const uniq = require("lodash.uniq");
const ses = require("../external-services/ses");
const venueEventMonitorRepository = require("../persistence/venue-event-monitor-repository");
const venueMonitorRepository = require("../persistence/venue-monitor-repository");
const lambda = require("../external-services/lambda");
const constants = require("../constants");

exports.sendMonitorStatusEmail = async function() {
  const venueEventMonitors = await venueEventMonitorRepository.getNewOrChanged();

  const idsOfVenuesWithEvents = uniq(
    venueEventMonitors.map(monitor => monitor.venueId)
  ).sort();

  const venueMonitors = await venueMonitorRepository.getChanged();

  const idsOfChangedVenues = uniq(
    venueMonitors.map(monitor => monitor.venueId)
  ).sort();

  const latestIterationErrors = await lambda.invoke(
    process.env.SERVERLESS_GET_LATEST_ITERATION_ERRORS_LAMBDA_NAME,
    { actionId: constants.ITERATE_VENUES_ACTION_ID }
  );

  const parsedErrors =
    latestIterationErrors && latestIterationErrors.body
      ? JSON.parse(latestIterationErrors.body)
      : {};

  const bodyText = [
    "Changed or New Events:",
    idsOfVenuesWithEvents.join("\n") || "NONE",
    "Changed Venue Data:",
    idsOfChangedVenues.join("\n") || "NONE",
    "Latest Errors:",
    (parsedErrors.errors || [])
      .map(error => (error.entityId || "") + ": " + (error.message || ""))
      .join("\n") || "NONE"
  ].join("\n\n");

  const email = {
    Destination: {
      ToAddresses: ["steve@stevejay.net"]
    },
    Message: {
      Body: {
        Text: {
          Data: bodyText
        }
      },
      Subject: {
        Data: "Venue Monitor Email"
      }
    },
    Source: "support@artfully.london"
  };

  await ses.sendEmail(email);
};
