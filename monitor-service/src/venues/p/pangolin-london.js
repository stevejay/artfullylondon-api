'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.pangolinlondon.com';

exports.pageFinder = async function() {
  const result = [];

  let $ = await pageLoader(`${BASE_URL}/exhibitions/current`);
  $('ul.exhibitions li a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  $ = await pageLoader(`${BASE_URL}/exhibitions/future`);
  $('ul.exhibitions li a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('.title h2').html();

  const data = [
    $('#content .title').html(),
    $('#content .exhibition-info').html(),
    $('#content .description').html(),
  ];

  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL);
  return $('.opening-hours').html();
};
