'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.artfirst.co.uk';

exports.pageFinder = async function() {
  const result = [];

  const $ = await pageLoader(BASE_URL + '/index.html');

  $('#current a').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('#content').html();
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader('http://www.artfirst.co.uk/about_us.html');
  return $('#content').html();
};
