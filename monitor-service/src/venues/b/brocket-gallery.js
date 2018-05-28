'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.brocketgallery.com';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(BASE_URL + '/');

  $('.index-collection:first-of-type ul li a').each(function() {
    const href = $(this).attr('href');

    if (href !== '/archive/') {
      result.push(BASE_URL + href);
    }
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('.image-detail-wrapper').html();
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/contact-1/');

  return $('#mainContent p').each(function() {
    $(this).html();
  });
};
