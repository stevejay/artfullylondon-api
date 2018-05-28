'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.waddingtoncustot.com';

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader(`${BASE_URL}/exhibitions/current-forthcoming/`);

  function hrefCallback() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  }

  $('#exhibitions-grid-current li a:has(img)').each(hrefCallback);
  $('#exhibitions-grid-current_featured li a:has(img)').each(hrefCallback);
  $('#exhibitions-grid-forthcoming li a:has(img)').each(hrefCallback);
  $('#exhibitions-grid-forthcoming_featured li a:has(img)').each(hrefCallback);

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('.exhibition-header h1').html();

  const data = [
    $('.exhibition-header').html(),
    $('.subsection-exhibition-detail').html(),
  ];

  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/gallery/contact/');
  return $('#content_module').html();
};
