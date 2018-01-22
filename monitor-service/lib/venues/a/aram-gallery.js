'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').spaLoader;

module.exports.pageParser = co.wrap(function*() {
  const $ = yield pageLoader(
    'https://www.thearamgallery.org/now',
    '#PAGES_CONTAINER'
  );

  const data = $('#PAGES_CONTAINER').html();
  return { data };
});
