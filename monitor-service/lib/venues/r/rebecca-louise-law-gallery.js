'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = co.wrap(function*() {
  const $ = yield pageLoader('http://www.rebeccalouiselaw.com/whats-on');

  const data = $('#wrapper section article').each(function() {
    return $(this).html();
  });

  return { data };
});
