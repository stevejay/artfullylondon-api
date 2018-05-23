'use strict';

const slug = require('limax');

const MIN_SLUG_LENGTH = 5;

exports.createIdFromName = (name, addEntropy) => {
  let result = slug(name, { maintainCase: false });

  if (addEntropy || result.length < MIN_SLUG_LENGTH) {
    result += _getRandomInt(1000, 9999);
  }

  return result;
};

// talents
exports.createIdFromTalentData = talent => {
  const prefix = talent.firstNames ? talent.firstNames + '-' : '';

  return exports.createIdFromName(
    prefix + talent.lastName + '-' + talent.commonRole
  );
};

// event
const YEAR_REGEX = /^(\d\d\d\d)\//;

exports.createEventId = (venueId, dateFrom, eventName) => {
  const year = dateFrom
    ? dateFrom.match(YEAR_REGEX)[1]
    : new Date().getUTCFullYear();

  return (
    (venueId + '/' + year + '/').toLowerCase() +
    exports.createIdFromName(eventName)
  );
};

exports.buildEventIdFromEventUrlParts = path => {
  return (path.idLocation +
    '/' +
    path.idYear +
    '/' +
    path.idName).toLowerCase();
};

exports.createExternalEventId = (venueId, eventUrl) => {
  const normalisedEventUrl =
    eventUrl.replace(/^https?:\/\/[^/]+/i, '').toLowerCase() || '/';

  return venueId + '|' + normalisedEventUrl;
};

function _getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
