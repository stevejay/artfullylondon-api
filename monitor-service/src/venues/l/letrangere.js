'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://letrangere.net';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(BASE_URL + '/exhibitions/');

  $('.exhibitions a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result.slice(0, 4);
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('.general_posts_details h1').html();
  const data = $('.general_posts_details').html();
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/contact/');
  return $('#content .contact_details').html();
};
