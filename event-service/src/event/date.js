"use strict";

const moment = require("moment");
const globalConstants = require("../constants");

exports.createStringDateFromToday = daysFromToday =>
  moment
    .utc()
    .startOf("day")
    .add(daysFromToday, "days")
    .format(globalConstants.DATE_FORMAT);

exports.createMomentFromStringDate = strDate =>
  moment.utc(strDate, globalConstants.DATE_FORMAT);

exports.createStringDateFromMoment = momentDate =>
  momentDate.format(globalConstants.DATE_FORMAT);

exports.getDayNumberFromMoment = momentDate => {
  const dateDay = momentDate.day();
  return dateDay - 1 + (dateDay === 0 ? 7 : 0);
};
