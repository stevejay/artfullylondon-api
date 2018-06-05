import { ALLOWED_VALUES } from "./entity-type";

export const INITIAL_VERSION_NUMBER = 0;

function createInitialWatches(entityType) {
  return {
    entityType,
    version: INITIAL_VERSION_NUMBER,
    items: []
  };
}

export function mapResponseForSingleWatchType(entityType, dbItem) {
  return dbItem ? dbItem : createInitialWatches(entityType);
}

export function mapResponseForAllWatchTypes(dbItems) {
  ALLOWED_VALUES.forEach(entityType => {
    if (dbItems.filter(x => x.entityType === entityType).length === 0) {
      dbItems.push(createInitialWatches(entityType));
    }
  });

  return { watches: dbItems };
}
