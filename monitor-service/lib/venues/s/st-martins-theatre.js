'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').spaLoader;

exports.pageParser = co.wrap(function*() {
  let $ = yield pageLoader(
    'https://www.the-mousetrap.co.uk/online/default.asp'
  );

  const data = $('#main_table').html();
  return { data };
});
