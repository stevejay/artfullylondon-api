'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.thebloomsbury.com';

exports.pageFinder = async function() {
  let result = [];
  let $ = await pageLoader(
    BASE_URL + '/event?type=All&title=&field_venue_tid=All&items_per_page=All'
  );

  $('ol h2 a').each(function() {
    let href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h1').html();
  const data = $('.content:has(h1)').html();
  return { title, data };
};
