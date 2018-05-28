'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.nhm.ac.uk';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(`${BASE_URL}/visit/exhibitions.html`);

  $('.main-section a:has(img)').each(function() {
    const href = $(this).attr('href');

    if (href.startsWith('/visit/exhibitions/')) {
      result.push(BASE_URL + href);
    }
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('.main-section h1').html();

  const data = $('.main-section p').each(function() {
    $(this).html();
  });

  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/visit/getting-here.html');

  return $('.info-sidebar').each(function() {
    $(this).html();
  });
};
