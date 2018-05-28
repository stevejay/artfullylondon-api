'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://londoncoliseum.org';

exports.pageFinder = async function() {
  const $ = await pageLoader(BASE_URL + '/');
  const result = [];

  $('#now > a').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  $('#coming a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('#top').html();
  return { title, data };
};
