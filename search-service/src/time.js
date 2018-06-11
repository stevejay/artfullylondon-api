import moment from "moment-timezone";

export const DATE_FORMAT = "YYYY/MM/DD";

export function getLondonNow() {
  return moment().tz("Europe/London");
}

export function formatAsStringDate(date) {
  return date.format(DATE_FORMAT);
}

export function createStringDateFromToday(daysFromToday) {
  return moment
    .utc()
    .startOf("day")
    .add(daysFromToday, "days")
    .format(DATE_FORMAT);
}

export function createMomentFromStringDate(strDate) {
  return moment.utc(strDate, DATE_FORMAT);
}

export function createStringDateFromMoment(momentDate) {
  return momentDate.format(DATE_FORMAT);
}

export function getDayNumberFromMoment(momentDate) {
  const dateDay = momentDate.day();
  return dateDay - 1 + (dateDay === 0 ? 7 : 0);
}
