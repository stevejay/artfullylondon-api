'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://leydengallery.com';

exports.pageFinder = async function() {
  const $ = await pageLoader(BASE_URL + '/');
  const result = [];

  $('a:contains("current exhibition")').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  $('a:contains("upcoming exhibition")').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('#page-title').html();
  const data = $('#main-content section').html();
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/contact');
  return $('section.contact').html();
};
