'use strict';

const co = require('co');
const uniq = require('lodash.uniq');
const ses = require('../external-services/ses');
const venueEventMonitorRepository = require('../persistence/venue-event-monitor-repository');
const venueMonitorRepository = require('../persistence/venue-monitor-repository');
const lambda = require('../external-services/lambda');
const constants = require('../constants');

module.exports.sendMonitorStatusEmail = co.wrap(function*() {
  const venueEventMonitors = yield venueEventMonitorRepository.getNewOrChanged();

  const idsOfVenuesWithEvents = uniq(
    venueEventMonitors.map(monitor => monitor.venueId)
  ).sort();

  const venueMonitors = yield venueMonitorRepository.getChanged();

  const idsOfChangedVenues = uniq(
    venueMonitors.map(monitor => monitor.venueId)
  ).sort();

  const latestIterationErrors = yield lambda.invoke(
    process.env.SERVERLESS_GET_LATEST_ITERATION_ERRORS_LAMBDA_NAME,
    { actionId: constants.ITERATE_VENUES_ACTION_ID }
  );

  const parsedErrors =
    latestIterationErrors && latestIterationErrors.body
      ? JSON.parse(latestIterationErrors.body)
      : {};

  const bodyText = [
    'Changed or New Events:',
    idsOfVenuesWithEvents.join('\n') || 'None',
    'Changed Venue Data:',
    idsOfChangedVenues.join('\n') || 'None',
    'Latest Errors:',
    (parsedErrors.errors || [])
      .map(error => (error.entityId || '') + ': ' + (error.message || ''))
      .join('\n') || 'None',
  ].join('\n\n');

  const email = {
    Destination: {
      ToAddresses: ['steve@stevejay.net'],
    },
    Message: {
      Body: {
        Text: {
          Data: bodyText,
        },
      },
      Subject: {
        Data: 'Venue Monitor Email',
      },
    },
    Source: 'support@artfully.london',
  };

  yield ses.sendEmail(email);
});
