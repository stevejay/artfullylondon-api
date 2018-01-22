'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.wmgallery.org.uk';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  let $ = yield pageLoader(`${BASE_URL}/whats-on/exhibitions-43`);

  $('#body a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  $ = yield pageLoader(`${BASE_URL}/whats-on/events-calendar`);

  $('#body a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('hgroup').html();
  const data = [$('#body section.info').html(), $('#body article').html()];
  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/visit');
  return $('#banner_grid').html();
});
