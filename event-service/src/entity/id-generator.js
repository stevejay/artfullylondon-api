import slug from "limax";
import _ from "lodash";
import * as entityType from "../types/entity-type";

const MIN_SLUG_LENGTH = 5;
const YEAR_REGEX = /^(\d\d\d\d)-/;

export function generateFromName(name, entityType) {
  return `${createEntityTypeSegment(entityType)}/${createIDSegment(name)}`;
}

export function generateFromTalent(talent) {
  const prefix = talent.firstNames ? talent.firstNames + "-" : "";
  return `${createEntityTypeSegment(entityType.TALENT)}/${createIDSegment(
    prefix + talent.lastName + "-" + talent.commonRole
  )}`;
}

export function generateFromEvent(event) {
  const year = event.dateFrom
    ? event.dateFrom.match(YEAR_REGEX)[1]
    : new Date().getUTCFullYear();
  const venueId = event.venue ? event.venue.id : event.venueId;
  const venueIdSegment = venueId.replace(/^venue\//, "");
  return `${createEntityTypeSegment(
    entityType.EVENT
  )}/${venueIdSegment}/${year}/${createIDSegment(event.name)}`;
}

function createEntityTypeSegment(entityType) {
  return _.kebabCase(entityType);
}

function createIDSegment(name, addEntropy) {
  let result = slug(name, { maintainCase: false });
  if (addEntropy || result.length < MIN_SLUG_LENGTH) {
    result += getRandomInt(1000, 9999);
  }
  return result;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
