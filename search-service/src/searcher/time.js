import moment from "moment-timezone";

export const DATE_FORMAT = "YYYY/MM/DD";

export function getLondonNow() {
  return moment().tz("Europe/London");
}

export function formatAsStringDate(moment) {
  return moment.format(DATE_FORMAT);
}
