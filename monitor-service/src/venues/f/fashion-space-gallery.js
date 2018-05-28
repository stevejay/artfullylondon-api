'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.fashionspacegallery.com';

exports.pageFinder = async function() {
  const $ = await pageLoader(BASE_URL + '/exhibitions/');
  const result = [];

  $('div:has(h3:contains("Current and Upcoming")) a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('.description_text').html();
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL);
  return $('.fsg-contact-us').html();
};
