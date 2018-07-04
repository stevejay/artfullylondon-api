import * as preferenceRepository from "./persistence/preference-repository";
import * as emailFrequencyType from "./email-frequency-type";

const DEFAULT_PREFERENCES = { emailFrequency: emailFrequencyType.DAILY };

export async function deletePreferences(request) {
  // Note: Preferences might not exist for the user.
  await preferenceRepository.deletePreferencesForUser(request.userId);
}

export async function getPreferences(request) {
  const preferences = await preferenceRepository.tryGetPreferencesForUser(
    request.userId
  );
  return preferences || DEFAULT_PREFERENCES;
}

export async function updatePreferences(request) {
  // Just do simple overwrite (no versioning)
  await preferenceRepository.updatePreferencesForUser(
    request.userId,
    request.preferences
  );
}
