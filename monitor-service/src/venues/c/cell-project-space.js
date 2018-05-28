'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = async function() {
  const $ = await pageLoader('http://www.cellprojects.org/exhibitions/future');
  const data = $('#main-container ul li article').html();
  return { data };
};
