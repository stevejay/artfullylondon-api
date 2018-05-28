'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://smokehousegallery.org/';

exports.pageFinder = async function() {
  const $ = await pageLoader(BASE_URL);
  const result = [];

  $('.post h2 > a').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result.slice(0, 4);
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h2.title').html();
  const data = $('#content .post').html();
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/visit/');
  return $('#content').html();
};
