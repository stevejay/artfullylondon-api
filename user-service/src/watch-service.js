import * as watchRepository from "./persistence/watch-repository";
import * as validator from "./validator";
import watchUpdater from "./watch-updater";
import * as watchMapper from "./watch-mapper";

export async function getWatches(request) {
  const dbItem = await watchRepository.tryGetWatchesByTypeForUser(
    request.userId,
    request.watchType
  );
  return watchMapper.mapResponseForSingleWatchType(request.watchType, dbItem);
}

export async function updateWatches(request) {
  validator.validateUpdateWatchesRequest(request);
  const currentWatches = await getWatches(request);
  const updatedWatches = watchUpdater(
    currentWatches.version,
    request.newVersion,
    currentWatches.items,
    request.changes
  );
  if (currentWatches.version === watchMapper.INITIAL_VERSION_NUMBER) {
    await watchRepository.createWatches(
      request.newVersion,
      request.userId,
      request.watchType,
      updatedWatches
    );
  } else {
    await watchRepository.updateWatches(
      request.newVersion,
      request.userId,
      request.watchType,
      updatedWatches
    );
  }
  return {
    items: updatedWatches,
    version: request.newVersion
  };
}

export async function deleteAllWatches(request) {
  await watchRepository.deleteWatchesForUser(request.userId);
}
