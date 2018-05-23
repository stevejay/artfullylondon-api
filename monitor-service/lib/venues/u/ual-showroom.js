'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = co.wrap(function*() {
  const data = [];

  const $ = yield pageLoader('http://www.arts.ac.uk/about-ual/ual-showroom/');

  $('h2:contains(\'Current show\') + p').each(function() {
    data.push($(this).html());
  });

  return { data };
});
