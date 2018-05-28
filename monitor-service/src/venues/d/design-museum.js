'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://designmuseum.org';

exports.pageFinder = async function() {
  const result = [];

  let $ = await pageLoader(BASE_URL + '/exhibitions');
  $(
    '.page-components section.row:first-of-type .page-item > a:has(figure)'
  ).each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  $ = await pageLoader(BASE_URL + '/exhibitions/future-exhibitions');
  $(
    '.page-components section.row:first-of-type .page-item > a:has(figure)'
  ).each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h1').html();

  const data = $('.component-content').each(function() {
    $(this).html();
  });

  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(
    BASE_URL + '/plan-your-visit/redirect-times-and-prices'
  );

  return $('.page-components').html();
};
