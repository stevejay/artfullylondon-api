'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.hamiltonsgallery.com';

exports.pageFinder = async function() {
  const $ = await pageLoader(BASE_URL + '/');
  const result = [];

  $('#content_below a').each(function() {
    const href = $(this).attr('href');

    if (href.startsWith('/exhibitions/')) {
      result.push(BASE_URL + href);
    }
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h1').html();
  const data = $('.exhibition-header').html();
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/contact_hamiltonsgallery_london/');
  return $('#content_module').html();
};
