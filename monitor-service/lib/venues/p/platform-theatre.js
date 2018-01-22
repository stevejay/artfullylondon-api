'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').spaLoader;

module.exports.pageParser = co.wrap(function*() {
  const $ = yield pageLoader(
    'http://www.arts.ac.uk/csm/whats-on-at-csm/platform-theatre/',
    'h1.WhatsOnHeading'
  );

  const title = $('title').html();
  const data = $('.EventsList .Events').html();
  return { data, title };
});
