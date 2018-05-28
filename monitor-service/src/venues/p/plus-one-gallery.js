'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.plusonegallery.com';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(`${BASE_URL}/exhibitions/`);

  function hrefCallback() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  }

  $('#exhibitions-grid-current ul li a:has(img)').each(hrefCallback);
  $('#exhibitions-grid-current_featured ul li a:has(img)').each(hrefCallback);
  $('#exhibitions-grid-forthcoming ul li a:has(img)').each(hrefCallback);

  $('#exhibitions-grid-forthcoming_featured ul li a:has(img)').each(
    hrefCallback
  );

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h1').html();

  const data = [
    $('.exhibition-header').html(),
    $('#content_module .description').html(),
  ];

  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/contact/');
  return $('#content_module').html();
};
