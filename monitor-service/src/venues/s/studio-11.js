'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.studio1-1.co.uk/';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(BASE_URL);

  $('.page-entry-content p a').each(function() {
    const href = $(this).attr('href');

    if (!href.endsWith('.jpeg')) {
      result.push(href);
    }
  });

  return result.slice(0, 5);
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h1.entry-title').html();
  const data = $('#content').html();
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + 'contact/');
  return $('#content .page-entry-content').html();
};
