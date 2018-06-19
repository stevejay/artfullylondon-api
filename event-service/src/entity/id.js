import slug from "limax";

const MIN_SLUG_LENGTH = 5;

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

const YEAR_REGEX = /^(\d\d\d\d)\//;

export function createEventId(venueId, dateFrom, eventName) {
  const year = dateFrom
    ? dateFrom.match(YEAR_REGEX)[1]
    : new Date().getUTCFullYear();

  return (
    (venueId + "/" + year + "/").toLowerCase() + createIdFromName(eventName)
  );
}

export function buildEventIdFromEventUrlParts(path) {
  return (
    path.idLocation +
    "/" +
    path.idYear +
    "/" +
    path.idName
  ).toLowerCase();
}

const PROTOCOL_REGEX = /^https?:\/\/[^/]+/i;

export function createExternalEventId(venueId, eventUrl) {
  const normalisedEventUrl =
    eventUrl.replace(PROTOCOL_REGEX, "").toLowerCase() || "/";
  return venueId + "|" + normalisedEventUrl;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
