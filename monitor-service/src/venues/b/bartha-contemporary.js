'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.barthacontemporary.com';

exports.pageFinder = async function() {
  let result = [];
  let $ = await pageLoader(BASE_URL + '/exhibitions/');

  $('#current_exhibitions + article a').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  $('#upcoming_exhibitions  + article a').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result.map(x => (x.endsWith('/') ? x : x + '/'));
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();
  const data = [$('article .info-list').html(), $('.description').html()];
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/contact/');
  return $('body > .container').html();
};
