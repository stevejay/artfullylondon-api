'use strict';

const log = require('loglevel');
const co = require('co');
const ensure = require('ensure-request').ensure;
const ManagementClient = require('auth0').ManagementClient;
const watchesService = require('./watches-service');
const preferencesService = require('./preferences-service');
const constraints = require('../data/constraints');
const constants = require('../constants');
const ensureErrorHandler = require('../data/ensure-error-handler');
const watchRepository = require('../persistence/watch-repository');

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

exports.deleteUser = co.wrap(function*(request) {
  var management = new ManagementClient({
    token: process.env.AUTH0_MANAGEMENT_API_TOKEN,
    domain: process.env.AUTH0_MANAGEMENT_API_DOMAIN,
  });

  yield management.users.delete({ id: request.userId });

  try {
    yield watchesService.deleteAllWatches(request.userId);
    yield preferencesService.deletePreferences(request.userId);
  } catch (err) {
    log.error('cleanup error: ' + err.message);
  }
});

exports.getPreferences = co.wrap(function*(request) {
  yield preferencesService.getPreferences(request.userId);
});

exports.getAllWatches = co.wrap(function*(request) {
  yield watchesService.getAllWatches(request.userId);
});

exports.getWatches = co.wrap(function*(request) {
  ensure(request, GET_WATCHES_CONSTRAINT, ensureErrorHandler);
  return yield watchesService.getWatches(request.userId, request.entityType);
});

exports.updatePreferences = co.wrap(function*(request) {
  ensure(request, UPDATE_PREFERENCES_CONSTRAINT, ensureErrorHandler);
  request.preferences.userId = request.userId;

  yield preferencesService.updatePreferences(
    request.userId,
    request.preferences
  );
});

exports.updateWatches = co.wrap(function*(request) {
  ensure(request, UPDATE_WATCHES_CONSTRAINT, ensureErrorHandler);

  // get the existing watches
  const currentWatches = yield watchesService.getWatches(
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

  yield watchRepository.createOrUpdateWatches(
    currentWatches.version,
    request.newVersion,
    request.userId,
    request.entityType,
    currentWatches.items
  );
});
