'use strict';

const log = require('loglevel');
const ensure = require('ensure-request').ensure;
const ManagementClient = require('auth0').ManagementClient;
const constants = require('../constants');
const watchesService = require('./watches-service');
const preferencesService = require('./preferences-service');
const constraints = require('../domain/constraints');
const ensureErrorHandler = require('../domain/ensure-error-handler');
const watchRepository = require('./watch-repository');

const UPDATE_PREFERENCES_CONSTRAINT = {
  preferences: {
    object: {
      emailFrequency: {
        presence: true,
        inclusion: constants.ALLOWED_EMAIL_FREQUENCY_TYPES,
      },
    },
  },
};

const UPDATE_WATCHES_CONSTRAINT = {
  entityType: constraints.entityType,
  newVersion: constraints.version,
  changes: {
    presence: true,
    array: true,
    length: constants.MAX_WATCHES_LENGTH,
    each: {
      object: {
        changeType: constraints.changeType,
        id: constraints.id,
        label: constraints.label,
        created: constraints.created,
      },
    },
  },
};

const GET_WATCHES_CONSTRAINT = { entityType: constraints.entityType };

exports.deleteUser = async function(request) {
  const management = new ManagementClient({
    token: process.env.AUTH0_MANAGEMENT_API_TOKEN,
    domain: process.env.AUTH0_MANAGEMENT_API_DOMAIN,
  });

  await management.users.delete({ id: request.userId });

  try {
    await watchesService.deleteAllWatches(request.userId);
    await preferencesService.deletePreferences(request.userId);
  } catch (err) {
    log.error('cleanup error: ' + err.message);
  }
});

exports.getPreferences = await function (request) {
  await preferencesService.getPreferences(request.userId);
});

exports.getAllWatches = await function(request) {
  await watchesService.getAllWatches(request.userId);
});

exports.getWatches = await function (request) {
  ensure(request, GET_WATCHES_CONSTRAINT, ensureErrorHandler);
  return await watchesService.getWatches(request.userId, request.entityType);
});

exports.updatePreferences = await function(request) {
  ensure(request, UPDATE_PREFERENCES_CONSTRAINT, ensureErrorHandler);
  request.preferences.userId = request.userId;

  await preferencesService.updatePreferences(
    request.userId,
    request.preferences
  );
});

exports.updateWatches = await function (request) {
  ensure(request, UPDATE_WATCHES_CONSTRAINT, ensureErrorHandler);

  // get the existing watches
  const currentWatches = await watchesService.getWatches(
    request.userId,
    request.entityType
  );

  // check the updates were created on top of the most recent server data
  if (currentWatches.version !== request.newVersion - 1) {
    throw new Error('[400] Stale data');
  }

  // apply any changes
  if (request.changes.length > 0) {
    const existingIdsLookup = {};
    currentWatches.items.forEach(item => (existingIdsLookup[item.id] = true));

    request.changes.forEach(change => {
      if (change.changeType === constants.WATCH_CHANGE_TYPE_ADD) {
        if (!existingIdsLookup[change.id]) {
          // TODO should I update them?
          existingIdsLookup[change.id] = true;

          currentWatches.items.push({
            id: change.id,
            label: change.label,
            created: change.created,
          });
        }
      } else if (existingIdsLookup[change.id]) {
        delete existingIdsLookup[change.id];

        currentWatches.items = currentWatches.items.filter(
          item => item.id !== change.id
        );
      }
    });
  }

  // throw if the list of watches has grown too large
  if (currentWatches.items.length > constants.MAX_WATCHES_LENGTH) {
    throw new Error('[400] Too many watches');
  }

  await watchRepository.createOrUpdateWatches(
    currentWatches.version,
    request.newVersion,
    request.userId,
    request.entityType,
    currentWatches.items
  );
});
