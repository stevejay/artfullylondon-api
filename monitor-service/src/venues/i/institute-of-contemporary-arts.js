'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.ica.art';

exports.pageFinder = async function() {
  const $ = await pageLoader(BASE_URL + '/whats-on/exhibitions');
  const result = [];

  $('.view-production-listing h3 > a').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h1').html();
  const data = [$('.book-block').html(), $('.block-copy').html()];
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/opening-hours');
  return $('.block-copy').html();
};
