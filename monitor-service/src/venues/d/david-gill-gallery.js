'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.davidgillgallery.com';

exports.pageFinder = async function() {
  const $ = await pageLoader(BASE_URL + '/2015/');
  const result = [];

  $('h2 a').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result.slice(0, 4);
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();

  const data = $('#page p').each(function() {
    $(this).html();
  });

  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/contact/');
  return $('.sqs-block-content:has(h3:contains("Opening Times"))').html();
};