'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.richardsaltoun.com';

// TODO check all the exhibitions-grid-xxx sites again to see if
// needs # or . before the names

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(`${BASE_URL}/exhibitions/`);

  function hrefCallback() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  }

  $('.exhibitions-grid-current li a:has(img)').each(hrefCallback);
  $('.exhibitions-grid-current_featured li a:has(img)').each(hrefCallback);
  $('.exhibitions-grid-forthcoming li a:has(img)').each(hrefCallback);
  $('.exhibitions-grid-forthcoming_featured li a:has(img)').each(hrefCallback);

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('#main_content h1').html();
  const data = [$('#main_content .exhibition').html()];
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/contact/');
  return $('#content').html();
};
