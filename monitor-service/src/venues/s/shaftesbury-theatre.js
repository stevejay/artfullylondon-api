'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.shaftesburytheatre.com';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(`${BASE_URL}/`);

  $('#mainBg a:has(img)').each(function() {
    const href = $(this).attr('href');

    if (/\/shows\/./.test(href)) {
      result.push(href);
    }
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();
  const data = [$('#lowerContent').html()];
  return { title, data };
};
