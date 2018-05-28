'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://hackneyempire.co.uk';

exports.pageFinder = async function() {
  const $ = await pageLoader(BASE_URL + '/whats-on/');
  const result = [];

  $('#quick-by-select option').each(function() {
    const href = $(this).attr('value');

    if (href.includes('/whats-on/')) {
      result.push(href);
    }
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('main .show-content').html();
  return { title, data };
};
