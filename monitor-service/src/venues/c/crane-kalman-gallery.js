'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://cranekalman.com';

exports.pageFinder = async function() {
  const result = [];

  let $ = await pageLoader(BASE_URL + '/exhibitions/current/');
  $('div[id="container group"] a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  $ = await pageLoader(BASE_URL + '/exhibitions/future/');
  $('div[id="container group"] a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h1').html();
  const data = [$('#container h1').html(), $('#container div.date').html()];
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/contact/');
  return $('#container').html();
};
