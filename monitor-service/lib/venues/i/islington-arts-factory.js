'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

module.exports.pageParser = co.wrap(function*() {
  const $ = yield pageLoader(
    'http://www.islingtonartsfactory.org/exhibitions.html'
  );

  const data = $('#wsite-content .paragraph').each(function() {
    $(this).html();
  });

  return { data };
});
