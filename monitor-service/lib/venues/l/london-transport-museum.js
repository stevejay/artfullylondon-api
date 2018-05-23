'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = co.wrap(function*() {
  const $ = yield pageLoader('http://www.ltmuseum.co.uk/whats-on/exhibitions');
  const data = $('section.article-intro').html();
  return { data };
});
