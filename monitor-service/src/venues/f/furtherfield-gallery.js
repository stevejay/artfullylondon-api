'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.furtherfield.org';

exports.pageFinder = async function() {
  const $ = await pageLoader(BASE_URL + '/programmes/exhibitions');
  const result = [];

  $('.node a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result.slice(0, 3);
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h1').html();
  const data = $('#main .content').html();
  return { title, data };
};
