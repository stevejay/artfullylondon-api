'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.maureenpaley.com';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(BASE_URL + '/exhibitions');

  $('.exhibition-set-slice ul li a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('.slideshow__header__content').html();
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/contact');
  return $('.contact__opening-times').html();
};
