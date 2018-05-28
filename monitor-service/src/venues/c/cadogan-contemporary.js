'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.cadogancontemporary.com';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(BASE_URL + '/exhibition/');

  $('section .exhibitionArray a').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h1').html();
  const data = $('main section').html();
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/contact/');
  return $('.pageMain article').html();
};
