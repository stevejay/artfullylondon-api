'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://thelittleboxoffice.com';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(BASE_URL + '/brookside/');

  $('h3 a').each(function() {
    const href = $(this).attr('href');

    if (href.startsWith('/brookside/event/')) {
      result.push(BASE_URL + href);
    }
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('.content-title h1').html();
  const data = $('#section1').html();
  return { title, data };
};
