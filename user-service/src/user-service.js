import * as watchService from "./watch-service";
import * as preferenceService from "./preference-service";

export async function getUser(request) {
  const watches = await watchService.getAllWatches(request);
  const preferences = await preferenceService.getPreferences(request);
  return { ...watches, ...preferences };
}

export async function deleteUser(request) {
  await watchService.deleteAllWatches(request);
  await preferenceService.deletePreferences(request);
  return { acknowledged: true };
}
