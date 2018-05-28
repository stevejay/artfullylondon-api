'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.oldvictheatre.com';

exports.pageFinder = async function() {
  const $ = await pageLoader(`${BASE_URL}/whats-on`);
  const result = [];

  $('a:contains("View More")').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('main').html();
  return { title, data };
};
