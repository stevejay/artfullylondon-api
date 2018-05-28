'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://bethlemgallery.com';

exports.pageFinder = async function() {
  const result = [];
  let $ = await pageLoader(BASE_URL + '/whats-on/');

  $('#main .type-event a').each(function() {
    let href = $(this).attr('href');
    result.push(href.startsWith(BASE_URL) ? href : BASE_URL + '/' + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('#content article').html();
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/location/');
  return $('section.entry-content').html();
};
