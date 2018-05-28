'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.gasworks.org.uk';

exports.pageFinder = async function() {
  const result = [];

  let $ = await pageLoader(BASE_URL + '/events/');
  $('article h1 > a').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('header.page-header h1').html();
  const data = $('.contents.page').html();
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/contact/');
  return $('article.visit-us').html();
};
