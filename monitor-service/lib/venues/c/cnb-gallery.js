'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = co.wrap(function*() {
  const $ = yield pageLoader('http://cnbgallery.com/current-exhibition/');

  const data = $('#inner-content p').each(function() {
    $(this).html();
  });

  return { data };
});
