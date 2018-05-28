'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://adremgroup.com';

exports.pageFinder = async function() {
  const $ = await pageLoader(BASE_URL + '/dreamspace-gallery/');
  const result = [];

  $('article a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h1').html();
  const data = $('article .content').html();
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/dreamspace-gallery/');
  return $('.container-main .sidebar-widget').html();
};
