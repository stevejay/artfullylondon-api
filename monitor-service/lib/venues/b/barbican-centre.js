'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.barbican.org.uk';

exports.pageFinder = co.wrap(function*() {
  const result = [];

  let $ = yield pageLoader(
    BASE_URL + '/theatre/series.asp?id=1136&show=listing'
  );

  $('a.search-result-title').each(function() {
    const href = $(this).attr('href');
    result.push(href.startsWith(BASE_URL) ? href : BASE_URL + href);
  });

  $ = yield pageLoader(BASE_URL + '/artgallery');

  $('a.search-result-info').each(function() {
    const href = $(this).attr('href');
    result.push(href.startsWith(BASE_URL) ? href : BASE_URL + href);
  });

  // TODO think about what to do about these music listings.

  // $ = yield pageLoader(BASE_URL + '/classical1617/concert-listings/all-events');
  // $('a.search-result-title').each(function() {
  //     const href = $(this).attr('href');
  //     result.push(BASE_URL + href);
  // });

  // $ = yield pageLoader(BASE_URL + '/classical1718/AllConcerts.html');
  // $('a.search-result-title').each(function() {
  //     const href = $(this).attr('href');
  //     result.push(href);
  // });

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();

  const data = [
    $('.event-title--left').html(),
    $('.event-description p').html(),
    $('.event-description').html(),
  ];

  return { title, data };
});
