import * as watchService from "./watch-service";
import * as preferenceService from "./preference-service";
import * as userRepository from "./persistence/user-repository";

export async function getUser(request) {
  return await watchService.getAllWatches(request);
}

export async function deleteUser(request) {
  await userRepository.deleteUser(request.userId);
  await watchService.deleteAllWatches(request.userId);
  await preferenceService.deletePreferences(request.userId);
  return { acknowledged: true };
}
