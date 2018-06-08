'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.cptheatre.co.uk';

exports.pageFinder = async function() {
  const $ = await pageLoader(BASE_URL + '/whats-on/');
  const result = [];

  $('main h2 a').each(function() {
    const href = $(this).attr('href');

    if (href.includes('/production/')) {
      result.push(href);
    }
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h1').html();

  const data = $('article p').each(function() {
    $(this).html();
  });

  return { title, data };
};