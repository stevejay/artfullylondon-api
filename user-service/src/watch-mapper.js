import { ALLOWED_VALUES } from "./watch-type";

export const INITIAL_VERSION_NUMBER = 0;

function createInitialWatches(watchType) {
  return {
    watchType,
    items: [],
    version: INITIAL_VERSION_NUMBER
  };
}

export function mapResponseForSingleWatchType(watchType, dbItem) {
  return dbItem ? dbItem : createInitialWatches(watchType);
}

export function mapResponseForAllWatchTypes(dbItems) {
  ALLOWED_VALUES.forEach(watchType => {
    if (dbItems.filter(x => x.watchType === watchType).length === 0) {
      dbItems.push(createInitialWatches(watchType));
    }
  });

  return { watches: dbItems };
}
