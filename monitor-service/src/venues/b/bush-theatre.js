'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.bushtheatre.co.uk';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(BASE_URL + '/whats-on/');

  $('main a').each(function() {
    const href = $(this).attr('href');

    if (href.includes('/event/')) {
      result.push(href);
    }
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h1').html();
  const data = $('main #anchor-details').html();
  return { title, data };
};
