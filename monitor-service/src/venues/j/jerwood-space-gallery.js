'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.jerwoodvisualarts.org';

exports.pageFinder = async function() {
  const $ = await pageLoader(BASE_URL + '/events/');
  const result = [];

  $('#main-listing li > a:has(img)').each(function() {
    let href = $(this).attr('href');

    if (!href.startsWith('http')) {
      href = BASE_URL + href;
    }

    result.push(href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h1').html();
  const data = [$('.venue-details').html(), $('.entry-content').html()];
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/jerwood-space-visitor-information/');
  return $('.page').html();
};
