'use strict';

const preferenceRepository = require('../persistence/preference-repository');
const constants = require('../constants');

exports.deletePreferences = function*(userId) {
  // Note: Preferences might not exist for the user.
  yield preferenceRepository.deletePreferencesForUser(userId);
};

exports.getPreferences = function*(userId) {
  const dbItem = yield preferenceRepository.tryGetPreferencesForUser(userId);

  return dbItem
    ? dbItem
    : { emailFrequency: constants.EMAIL_FREQUENCY_TYPE_DAILY };
};

exports.updatePreferences = function*(userId, preferences) {
  // Just do simple overwrite (no versioning)
  yield preferenceRepository.updatePreferencesForUser(userId, preferences);
};
