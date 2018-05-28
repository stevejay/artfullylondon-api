'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.ftmlondon.org';

exports.pageFinder = async function() {
  const result = [];

  let $ = await pageLoader(BASE_URL + '/whats-on/exhibitions-and-displays/');
  $('article .press-office a:has(img)').each(function() {
    const href = $(this).attr('href');

    if (href.includes('/ftm-exhibitions/')) {
      result.push(href);
    }
  });

  $ = await pageLoader(BASE_URL + '/whats-on/talks-and-events/');
  $('h4 > a').each(function() {
    const href = $(this).attr('href');

    if (href.includes('/ftm-whats-on/')) {
      result.push(href);
    }
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h1').html();

  const data = $('article section p').each(function() {
    $(this).html();
  });

  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/visit-ftm/map-and-directions/');
  return $('#sidebar').html();
};
