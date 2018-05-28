'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://almeida.co.uk';

exports.pageFinder = async function() {
  const $ = await pageLoader(BASE_URL + '/whats-on');
  const result = [];

  $('.card a').each(function() {
    const href = $(this).attr('href');

    if (href.toLowerCase().includes('/whats-on/')) {
      result.push(BASE_URL + href);
    }
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h1').html();

  const data = $('.content-box').each(function() {
    return $(this).html();
  });

  return { title, data };
};
