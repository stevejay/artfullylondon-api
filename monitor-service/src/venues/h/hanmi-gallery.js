'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.hanmigallery.co.uk';

exports.pageFinder = async function() {
  const result = [];

  let $ = await pageLoader(BASE_URL + '/exhibitions/current/');
  $('#content ul li.links a:contains("Press Release")').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  $ = await pageLoader(BASE_URL + '/exhibitions/future/');
  $('#content ul li.links a:contains("Press Release")').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('#content h2').html();
  const data = $('#content_area').html();
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/contact/london/');
  return $('#content_area').html();
};
