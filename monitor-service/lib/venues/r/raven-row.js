'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = co.wrap(function*() {
  let $ = yield pageLoader('http://www.ravenrow.org/forthcoming/');

  const data = $('.wrapwrap .mb_sngl').each(function() {
    return $(this).html();
  });

  return { data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader('http://www.ravenrow.org/home/');
  return $('.openinghours').html();
});
