import moment from "moment-timezone";
import * as constants from "../constants";

export function getLondonNow() {
  return moment().tz("Europe/London");
}

export function formatAsStringDate(moment) {
  return moment.format(constants.DATE_FORMAT);
}
