'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').spaLoader;

exports.pageParser = co.wrap(function*() {
  const $ = yield pageLoader(
    'http://www.clfartcafe.org/theatre',
    '#PAGES_CONTAINERinlineContent'
  );

  const data = $('#PAGES_CONTAINERinlineContent').html();
  return { data };
});
