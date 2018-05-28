'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.pilarcorrias.com';

exports.pageFinder = async function() {
  const result = [];

  let $ = await pageLoader(`${BASE_URL}/exhibitions/?show=current`);
  $('#container article h1 a').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  $ = await pageLoader(`${BASE_URL}/exhibitions/?show=future`);
  $('#container article h1 a').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('#content h1').html();
  const data = $('#content article header').html();
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/contact/');

  return $('#content p').each(function() {
    $(this).html();
  });
};
