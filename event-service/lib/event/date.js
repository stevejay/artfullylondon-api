'use strict';

const moment = require('moment');
const globalConstants = require('../constants');

exports.createStringDateFromToday = daysFromToday => {
  return moment
    .utc()
    .startOf('day')
    .add(daysFromToday, 'days')
    .format(globalConstants.DATE_FORMAT);
};

exports.createMomentFromStringDate = strDate => {
  return moment.utc(strDate, globalConstants.DATE_FORMAT);
};

exports.createStringDateFromMoment = momentDate => {
  return momentDate.format(globalConstants.DATE_FORMAT);
};

exports.getDayNumberFromMoment = momentDate => {
  const dateDay = momentDate.day();
  return dateDay - 1 + (dateDay === 0 ? 7 : 0);
};
