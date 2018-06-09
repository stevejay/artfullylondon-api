import moment from "moment-timezone";

export const DATE_FORMAT = "YYYY/MM/DD";

export function getLondonNow() {
  return moment().tz("Europe/London");
}

export function formatAsStringDate(date) {
  return date.format(DATE_FORMAT);
}
