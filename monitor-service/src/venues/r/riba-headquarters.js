'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.architecture.com';

// Site is currently hosed.

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(
    `${BASE_URL}/WhatsOn/WhatsOn.aspx?type=cultural&location=0%2f660%2f666%2f669`
  );

  $(
    'article.brick-event:has(.brick-location:contains(\'RIBA\')) a:has(img)'
  ).each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('.articleHeader h1').html();
  const data = [$('#mainContent article').html()];
  return { title, data };
};
