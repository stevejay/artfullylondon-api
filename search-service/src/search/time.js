'use strict';

const moment = require('moment-timezone');
const constants = require('../constants');

exports.getLondonNow = function() {
  return moment().tz('Europe/London');
};

exports.formatAsStringDate = function(moment) {
  return moment.format(constants.DATE_FORMAT);
};
