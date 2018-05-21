"use strict";

const watchRepository = require("./watch-repository");
const constants = require("./constants");

exports.deleteAllWatches = async function(userId) {
  // We delete all entity types, but they might not all exist.

  const deleteRequests = constants.ALLOWED_ENTITY_TYPES.map(entityType => {
    return { DeleteRequest: { Key: { userId, entityType } } };
  });

  await watchRepository.deleteWatchesForUser(deleteRequests);
};

exports.getWatches = async function(userId, entityType) {
  const dbItem = await watchRepository.tryGetWatchesByTypeForUser(
    userId,
    entityType
  );

  return {
    entityType: entityType,
    version: dbItem ? dbItem.version : constants.INITIAL_VERSION_NUMBER,
    items: dbItem ? dbItem.items : []
  };
};

exports.getAllWatches = async function(userId) {
  const dbItems = await watchRepository.getAllWatchesForUser(userId);

  constants.ALLOWED_ENTITY_TYPES.forEach(entityType => {
    if (dbItems.filter(x => x.entityType === entityType).length === 0) {
      dbItems.push({
        entityType,
        version: constants.INITIAL_VERSION_NUMBER,
        items: []
      });
    }
  });

  return dbItems;
};
