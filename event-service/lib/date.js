'use strict';

const moment = require('moment');
const globalConstants = require('./constants');

exports.getTodayAsStringDate = () => {
  return moment.utc().format(globalConstants.DATE_FORMAT);
};