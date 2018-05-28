'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.tiwani.co.uk';

exports.pageFinder = async function() {
  const result = [];

  let $ = await pageLoader(BASE_URL + '/exhibitions/upcoming/');

  $('body > .container-fluid a').each(function() {
    const href = $(this).attr('href');

    if (href.includes('/exhibitions/')) {
      result.push(href);
    }
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);

  const title = $('.gallery-item h2').each(function() {
    return $(this).html();
  });

  const data = $('.gallery-item').html();
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/contact/');
  return $('body > .container-fluid').html();
};
