'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://galleryfumi.com';

exports.pageFinder = async function() {
  const result = [];

  let $ = await pageLoader(BASE_URL + '/exhibitions/');
  $('section.section--exhibitions a:has(h4)').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  $ = await pageLoader(BASE_URL + '/exhibitions/future/');
  $('section.section--exhibitions a.exhibition-item').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('.section-header h2').html();

  const data = [
    $('.section-header p').html(),
    $('section.section--exhibition-details').html(),
  ];

  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/contact/');
  return $('section.fumi-location').html();
};
