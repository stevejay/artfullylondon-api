'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://wellhung.co.uk';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(`${BASE_URL}/exhibitions/`);

  const callback = function() {
    const href = $(this).attr('href');

    if (href.startsWith('http')) {
      result.push(href);
    }
  };

  $('.next-exhibition a').each(callback);
  $('.future-exhibitions-list a').each(callback);
  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('#main h1').html();
  const data = $('#main').html();
  return { title, data };
};
