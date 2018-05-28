'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.offwestend.com';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(BASE_URL + '/index.php/theatres/shows/42');

  $('a:has(b:contains("More info"))').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('meta[name="description"]').prop('content');
  return { title, data };
};
