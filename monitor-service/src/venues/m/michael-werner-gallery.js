'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://michaelwerner.com';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(`${BASE_URL}/exhibitions/current`);

  $(
    '#exhibitions_content .ExhibitionSummary a:has(.ExhibitionLocation:contains("MAYFAIR"))'
  ).each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('.ExhibitionTitle').html();
  const data = $('#exhibitions_content').html();
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/location/1951');
  return $('.LocationMapDetails').html();
};
