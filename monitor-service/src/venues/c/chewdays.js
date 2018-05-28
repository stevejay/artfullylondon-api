'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.chewdays.com';

exports.pageFinder = async function() {
  const $ = await pageLoader(BASE_URL + '/exhibitions---chewday-s.html');
  const result = [];

  $('#page a[data-muse-uid]').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + '/' + href);
  });

  return result.slice(0, 4);
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h1').html();

  const data = $('p[id]').slice(0, 12).each(function() {
    $(this).html();
  });

  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/contact.html');
  return $('#page').html();
};
