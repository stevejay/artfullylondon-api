import * as watchService from "./watch-service";
import * as preferenceService from "./preference-service";

export async function deleteUser(request) {
  await watchService.deleteAllWatches(request);
  await preferenceService.deletePreferences(request);
}
