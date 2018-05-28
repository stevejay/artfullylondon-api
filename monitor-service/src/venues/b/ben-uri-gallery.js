'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://benuri.org.uk';

exports.pageFinder = async function() {
  let result = [];
  let $ = await pageLoader(BASE_URL + '/exhibitions/');

  $('aside h4 a').each(function() {
    let href = $(this).attr('href');
    result.push(href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h1').html();
  const data = $('.tribe-events-single-section').html();
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/about-us/your-visit/');
  return $('main.content').html();
};
