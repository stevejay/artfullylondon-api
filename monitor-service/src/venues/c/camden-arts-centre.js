'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.camdenartscentre.org';

exports.pageFinder = async function() {
  const $ = await pageLoader(BASE_URL + '/whats-on/exhibitions');
  const result = [];

  $('#listing a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();
  const data = [$('#event p.dates').html(), $('#event #description').html()];
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL);
  return $('#times').html();
};
