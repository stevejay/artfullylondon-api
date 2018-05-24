"use strict";

const moment = require("moment");
const globalConstants = require("./constants");

exports.getTodayAsStringDate = () =>
  moment.utc().format(globalConstants.DATE_FORMAT);
