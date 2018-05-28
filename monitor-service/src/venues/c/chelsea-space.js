'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.chelseaspace.org';

exports.pageFinder = async function() {
  const result = [];

  let $ = await pageLoader(BASE_URL + '/index.html');
  $('a:contains("exhibition info")').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + '/' + href);
  });

  $ = await pageLoader(BASE_URL + '/future.html');
  $('a:contains("exhibition info")').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + '/' + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h1').html();

  const data = $('p').each(function() {
    $(this).html();
  });

  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/visit.html');
  return $('#content-archive-index').html();
};
