'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://galleryelenashchukina.com';

exports.pageFinder = async function() {
  const $ = await pageLoader(BASE_URL + '/exhibitions/');
  const result = [];

  function hrefCallback() {
    const href = $(this).attr('href');

    if (href.startsWith('/exhibitions/')) {
      result.push(BASE_URL + href);
    }
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
    $('#content_module h2').html(),
    $('#content_module .description').html(),
  ];

  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/contact/');
  return $('#content .content_column_text').html();
};
