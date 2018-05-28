'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.bloombergspace.com';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(BASE_URL + '/events/upcoming/');

  $('#main a:has(img)').each(function() {
    let href = $(this).attr('href');
    result.push(href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h1').html();
  const data = $('article').html();
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/visit/');

  return $('#content p').each(function() {
    $(this).html();
  });
};
