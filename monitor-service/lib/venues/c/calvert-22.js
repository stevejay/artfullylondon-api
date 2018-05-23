'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').spaLoader;

const BASE_URL = 'http://calvert22.org';

exports.pageFinder = co.wrap(function*() {
  let $ = yield pageLoader(
    BASE_URL + '/exhibitions-events/',
    'a.vc_gitem-link'
  );

  const result = [];

  $('main article .entry-content a.vc_gitem-link').each(function() {
    const href = $(this).attr('href');

    if (href.indexOf('/category/') === -1 && result.indexOf(href) === -1) {
      result.push(href);
    }
  });

  return result.slice(0, 6); // TODO increase this at some point
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl, '.entry-content h1');
  const title = $('title').html();
  const data = $('main article .entry-content').html();
  return { title, data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(
    BASE_URL + '/visit/',
    'main article .entry-content'
  );

  return $('main article .entry-content').html();
});
