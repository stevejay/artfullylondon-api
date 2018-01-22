'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const preferencesService = require('../../lib/services/preferences-service');
const constants = require('../../lib/constants');
const preferenceRepository = require('../../lib/persistence/preference-repository');

const USER_ID = 'email|12345';

describe('preferences-service', () => {
  describe('deletePreferences', () => {
    afterEach(() => {
      preferenceRepository.deletePreferencesForUser.restore &&
        preferenceRepository.deletePreferencesForUser.restore();
    });

    it('should delete preferences', function*() {
      sinon
        .stub(preferenceRepository, 'deletePreferencesForUser')
        .callsFake(userId => {
          expect(userId).to.eql(USER_ID);
          return Promise.resolve();
        });

      yield preferencesService.deletePreferences(USER_ID);
    });
  });

  describe('updatePreferences', () => {
    afterEach(function() {
      preferenceRepository.updatePreferencesForUser.restore &&
        preferenceRepository.updatePreferencesForUser.restore();
    });

    it('should update preferences', function*() {
      sinon
        .stub(preferenceRepository, 'updatePreferencesForUser')
        .callsFake((userId, preferences) => {
          expect(userId).to.eql(USER_ID);
          expect(preferences).to.eql({
            emailFrequency: constants.EMAIL_FREQUENCY_TYPE_WEEKLY,
          });

          return Promise.resolve();
        });

      yield preferencesService.updatePreferences(USER_ID, {
        emailFrequency: constants.EMAIL_FREQUENCY_TYPE_WEEKLY,
      });
    });
  });

  describe('getPreferences', () => {
    afterEach(function() {
      preferenceRepository.tryGetPreferencesForUser.restore &&
        preferenceRepository.tryGetPreferencesForUser.restore();
    });

    it('should return default preferences data when preferences do not exist', function*() {
      sinon
        .stub(preferenceRepository, 'tryGetPreferencesForUser')
        .callsFake(userId => {
          expect(userId).to.eql(USER_ID);
          return Promise.resolve(null);
        });

      const actual = yield preferencesService.getPreferences(USER_ID);

      expect(actual).to.eql({
        emailFrequency: constants.EMAIL_FREQUENCY_TYPE_DAILY,
      });
    });

    it('should return db preferences data when preferences exist', function*() {
      sinon
        .stub(preferenceRepository, 'tryGetPreferencesForUser')
        .callsFake(userId => {
          expect(userId).to.eql(USER_ID);

          return Promise.resolve({
            emailFrequency: constants.EMAIL_FREQUENCY_TYPE_WEEKLY,
          });
        });

      const actual = yield preferencesService.getPreferences(USER_ID);

      expect(actual).to.eql({
        emailFrequency: constants.EMAIL_FREQUENCY_TYPE_WEEKLY,
      });
    });
  });
});
