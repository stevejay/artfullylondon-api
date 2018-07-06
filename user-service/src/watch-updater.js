import * as validator from "./validator";
import * as watchChangeType from "./watch-change-type";

export default function(currentVersion, newVersion, watches, changes) {
  // check the changes were created on top of the most recent server data
  if (currentVersion !== newVersion - 1) {
    throw new Error("[400] Stale data");
  }

  let updatedWatches = watches ? watches.slice() : [];

  // apply any changes
  if (changes.length > 0) {
    const existingIdsLookup = {};

    updatedWatches.forEach(item => {
      existingIdsLookup[item.id] = true;
    });

    changes.forEach(change => {
      if (change.changeType === watchChangeType.ADD) {
        if (!existingIdsLookup[change.id]) {
          existingIdsLookup[change.id] = true;
          updatedWatches.push({
            id: change.id,
            label: change.label
          });
        }
      } else if (change.changeType === watchChangeType.DELETE) {
        if (existingIdsLookup[change.id]) {
          delete existingIdsLookup[change.id];
          updatedWatches = updatedWatches.filter(item => item.id !== change.id);
        }
      }
    });
  }

  // throw if the list of watches has now grown too large
  if (updatedWatches.length > validator.MAX_WATCHES_LENGTH) {
    throw new Error("[400] Too many watches");
  }

  return updatedWatches;
}
