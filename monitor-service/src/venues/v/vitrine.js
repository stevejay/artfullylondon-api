'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.vitrinegallery.com';

exports.pageFinder = async function() {
  const result = [];

  let $ = await pageLoader(`${BASE_URL}/exhibitions/`);
  $('#exhib-list a:has(img)').each(function() {
    const href = $(this).attr('href');

    if (href && href.includes('/exhibitions/')) {
      result.push(href);
    }
  });

  $ = await pageLoader(`${BASE_URL}/future-exhibitions/`);
  $('#exhib-list a:has(img)').each(function() {
    const href = $(this).attr('href');

    if (href && href.includes('/exhibitions/')) {
      result.push(href);
    }
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('#main-wrapper h1').html();
  const data = $('#main-wrapper').html();
  return { title, data };
};
