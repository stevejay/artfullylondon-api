'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.frenchriviera1988.com';

exports.pageFinder = async function() {
  const $ = await pageLoader(BASE_URL + '/exhibitions');
  const result = [];

  $('#text ul li a').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + '/' + href);
  });

  return result.slice(0, 4);
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('#text ul li:first-of-type').html();

  const data = $('#text ul li').each(function() {
    $(this).html();
  });

  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/information');

  return $('#text ul li').each(function() {
    $(this).html();
  });
};
