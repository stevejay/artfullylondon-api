'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://cattogallery.co.uk';

exports.pageParser = async function() {
  const $ = await pageLoader(BASE_URL + '/exhibitions/');

  const data = $(
    'h2:contains("Forthcoming Exhibitions") ~ div'
  ).each(function() {
    $(this).html();
  });

  return { data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/contact/');

  return $('.page-content .row .content p:first-of-type')
    .nextUntil('hr')
    .each(function() {
      $(this).html();
    });
};
