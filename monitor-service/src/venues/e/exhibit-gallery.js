'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').spaLoader;

exports.pageParser = co.wrap(function*() {
  const $ = yield pageLoader(
    'http://www.exhibit-goldenlane.com/',
    'div.exhibit-name'
  );

  const data = $('div.exhibit-name').html();
  return { data };
});
