'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.daniellearnaud.com';

exports.pageFinder = async function() {
  const $ = await pageLoader(BASE_URL + '/exhibitions/exhibitions-index.html');
  const result = [];

  $('#content p a').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result.slice(0, 4);
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();

  const data = $('#content table tr p').each(function() {
    $(this).html();
  });

  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/contact/contact-index.html');
  return $('#content0').html();
};
