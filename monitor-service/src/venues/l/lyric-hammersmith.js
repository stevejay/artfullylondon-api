'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://lyric.co.uk';

exports.pageFinder = async function() {
  const result = [];

  const categories = ['main-house', 'studio', 'amici-in-rep', 'little-lyric'];

  for (let i = 0; i < categories.length; ++i) {
    const $ = await pageLoader(`${BASE_URL}/shows/category/${categories[i]}/`);

    $('.listing a:has(img)').each(function() {
      const href = $(this).attr('href');
      result.push(href);
    });
  }

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('#content-area h1').html();
  const data = $('#content-area article section').html();
  return { title, data };
};
