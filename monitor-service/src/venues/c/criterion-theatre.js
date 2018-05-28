'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.criterion-theatre.co.uk';

exports.pageFinder = async function() {
  const $ = await pageLoader(BASE_URL + '/whats-on');
  const result = [];

  $('.whats-on-description a').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h1').html();
  const data = $('.featured-block').html();
  return { title, data };
};
