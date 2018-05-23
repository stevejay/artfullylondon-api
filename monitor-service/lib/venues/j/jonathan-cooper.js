'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.jonathancooper.co.uk';

exports.pageFinder = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/exhibitions/');
  const result = [];

  function hrefCallback() {
    let href = $(this).attr('href');
    href = href.replace(/\/works\/$/, '/overview/');
    result.push(BASE_URL + href);
  }

  $('#exhibitions-grid-current li > a').each(hrefCallback);
  $('#exhibitions-grid-current_featured li > a').each(hrefCallback);
  $('#exhibitions-grid-forthcoming li > a').each(hrefCallback);
  $('#exhibitions-grid-forthcoming_featured li > a').each(hrefCallback);

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('h1').html();
  const data = [$('.subtitle_date').html(), $('.exhibition').html()];
  return { title, data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/contact/');
  return $('#content_module').html();
});
