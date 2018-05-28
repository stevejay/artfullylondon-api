'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = async function() {
  const $ = await pageLoader('http://www.p3exhibitions.com/future/');
  const data = $('.entryText').html();
  return { data };
};
