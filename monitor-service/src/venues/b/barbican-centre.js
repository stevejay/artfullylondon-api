'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.barbican.org.uk';

exports.pageFinder = async function() {
  const result = [];

  let $ = await pageLoader(
    BASE_URL + '/theatre/series.asp?id=1136&show=listing'
  );

  $('a.search-result-title').each(function() {
    const href = $(this).attr('href');
    result.push(href.startsWith(BASE_URL) ? href : BASE_URL + href);
  });

  $ = await pageLoader(BASE_URL + '/artgallery');

  $('a.search-result-info').each(function() {
    const href = $(this).attr('href');
    result.push(href.startsWith(BASE_URL) ? href : BASE_URL + href);
  });

  // TODO think about what to do about these music listings.

  // $ = await pageLoader(BASE_URL + '/classical1617/concert-listings/all-events');
  // $('a.search-result-title').each(function() {
  //     const href = $(this).attr('href');
  //     result.push(BASE_URL + href);
  // });

  // $ = await pageLoader(BASE_URL + '/classical1718/AllConcerts.html');
  // $('a.search-result-title').each(function() {
  //     const href = $(this).attr('href');
  //     result.push(href);
  // });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();

  const data = [
    $('.event-title--left').html(),
    $('.event-description p').html(),
    $('.event-description').html(),
  ];

  return { title, data };
};
