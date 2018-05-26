'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').spaLoader;

exports.pageParser = co.wrap(function*() {
  const data = [];

  const $ = yield pageLoader('https://www.woolffgallery.co.uk/');
  $('h2').each(function() {
    data.push($(this).html());
  });

  return { data };
});
