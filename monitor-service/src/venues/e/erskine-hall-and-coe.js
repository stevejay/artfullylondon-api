'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.erskinehallcoe.com';

exports.pageFinder = async function() {
  const $ = await pageLoader(BASE_URL + '/exhibitions/');
  const result = [];

  $('main > section a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('.c-exhibition-index__text').html();
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/contact/');
  return $('#main .c-contactpage__address').html();
};
