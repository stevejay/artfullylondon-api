'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.upstairsatthegatehouse.com';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(`${BASE_URL}/`);

  $('#menu-gatehouse > li:first-of-type a').each(function() {
    const href = $(this).attr('href');

    if (href && href.startsWith(BASE_URL)) {
      result.push(href);
    }
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('.entry-content').html();
  return { title, data };
};
