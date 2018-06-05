import * as preferenceRepository from "./persistence/preference-repository";
import * as emailFrequencyType from "./email-frequency-type";
import * as validator from "./validator";

const DEFAULT_PREFERENCES = { emailFrequency: emailFrequencyType.DAILY };

export async function deletePreferences(userId) {
  // Note: Preferences might not exist for the user.
  await preferenceRepository.deletePreferencesForUser(userId);
  return { acknowledged: true };
}

export async function getPreferences(request) {
  const preferences = await preferenceRepository.tryGetPreferencesForUser(
    request.userId
  );
  return { preferences: preferences || DEFAULT_PREFERENCES };
}

export async function updatePreferences(request) {
  validator.validateUpdatePreferencesRequest(request);
  // Just do simple overwrite (no versioning)
  await preferenceRepository.updatePreferencesForUser(
    request.userId,
    request.preferences
  );
  return { acknowledged: true };
}
