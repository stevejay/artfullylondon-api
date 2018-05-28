'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.blainsouthern.com';

exports.pageFinder = async function() {
  const result = [];
  let $ = await pageLoader(BASE_URL + '/exhibitions');

  $(
    'li.exhibition:has(.gallery_title:contains("London")) a:has(img)'
  ).each(function() {
    let href = $(this).attr('href');
    result.push(href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h1').html();
  const data = $('#center').html();
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/gallery-info');

  return $('#content #center p').each(function() {
    $(this).html();
  });
};
