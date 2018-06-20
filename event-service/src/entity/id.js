import slug from "limax";

const MIN_SLUG_LENGTH = 5;
const YEAR_REGEX = /^(\d\d\d\d)\//;

export function createIdFromName(name, addEntropy) {
  let result = slug(name, { maintainCase: false });
  if (addEntropy || result.length < MIN_SLUG_LENGTH) {
    result += getRandomInt(1000, 9999);
  }
  return result;
}

export function createIdFromTalentData(talent) {
  const prefix = talent.firstNames ? talent.firstNames + "-" : "";
  return createIdFromName(prefix + talent.lastName + "-" + talent.commonRole);
}

export function createEventId(venueId, dateFrom, eventName) {
  const year = dateFrom
    ? dateFrom.match(YEAR_REGEX)[1]
    : new Date().getUTCFullYear();

  return (
    (venueId + "/" + year + "/").toLowerCase() + createIdFromName(eventName)
  );
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
