'use strict';

const co = require('co');
const watchRepository = require('../persistence/watch-repository');
const constants = require('../constants');

exports.deleteAllWatches = co.wrap(function*(userId) {
  // We delete all entity types, but they might not all exist.

  const deleteRequests = constants.ALLOWED_ENTITY_TYPES.map(entityType => {
    return { DeleteRequest: { Key: { userId, entityType } } };
  });

  yield watchRepository.deleteWatchesForUser(deleteRequests);
});

exports.getWatches = co.wrap(function*(userId, entityType) {
  const dbItem = yield watchRepository.tryGetWatchesByTypeForUser(
    userId,
    entityType
  );

  return {
    entityType: entityType,
    version: dbItem ? dbItem.version : constants.INITIAL_VERSION_NUMBER,
    items: dbItem ? dbItem.items : [],
  };
});

exports.getAllWatches = co.wrap(function*(userId) {
  const dbItems = yield watchRepository.getAllWatchesForUser(userId);

  constants.ALLOWED_ENTITY_TYPES.forEach(entityType => {
    if (dbItems.filter(x => x.entityType === entityType).length === 0) {
      dbItems.push({
        entityType,
        version: constants.INITIAL_VERSION_NUMBER,
        items: [],
      });
    }
  });

  return dbItems;
});
