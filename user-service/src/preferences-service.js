"use strict";

const preferenceRepository = require("./preference-repository");
const constants = require("./constants");

exports.deletePreferences = async function(userId) {
  // Note: Preferences might not exist for the user.
  await preferenceRepository.deletePreferencesForUser(userId);
};

exports.getPreferences = async function(userId) {
  const dbItem = await preferenceRepository.tryGetPreferencesForUser(userId);

  console.log("getprefs", dbItem);

  return dbItem
    ? dbItem
    : { emailFrequency: constants.EMAIL_FREQUENCY_TYPE_DAILY };
};

exports.updatePreferences = async function(userId, preferences) {
  console.log("updatePrefs", preferences, userId);
  // Just do simple overwrite (no versioning)
  await preferenceRepository.updatePreferencesForUser(userId, preferences);
};
