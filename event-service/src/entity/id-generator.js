import slug from "limax";

const MIN_SLUG_LENGTH = 5;
const YEAR_REGEX = /^(\d\d\d\d)-/;

export function generateFromName(name, addEntropy) {
  let result = slug(name, { maintainCase: false });
  if (addEntropy || result.length < MIN_SLUG_LENGTH) {
    result += getRandomInt(1000, 9999);
  }
  return result;
}

export function generateFromTalent(talent) {
  const prefix = talent.firstNames ? talent.firstNames + "-" : "";
  return generateFromName(prefix + talent.lastName + "-" + talent.commonRole);
}

export function generateFromEvent(event) {
  const year = event.dateFrom
    ? event.dateFrom.match(YEAR_REGEX)[1]
    : new Date().getUTCFullYear();

  return (
    `${event.venue ? event.venue.id : event.venueId}/${year}/`.toLowerCase() +
    generateFromName(event.name)
  );
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
