'use strict';

const padStart = require('lodash.padstart');

module.exports.formatDate = date => {
  const fullYear = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${fullYear}/${padStart(month, 2, '0')}/${padStart(day, 2, '0')}`;
};
