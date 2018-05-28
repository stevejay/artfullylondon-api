'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://kristinhjellegjerde.com';

exports.pageFinder = async function() {
  const $ = await pageLoader(BASE_URL + '/exhibitions/forthcoming/');
  const result = [];

  $('#exhibitions-grid-forthcoming_featured ul li a').each(function() {
    let href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  $('#exhibitions-grid-forthcoming ul li a').each(function() {
    let href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('.exhibition-header h1').html();

  const data = [
    $('.exhibition-header').html(),
    $('#content_module .description').html(),
  ];

  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/contact');
  return $('.contact-locations-grid .content').html();
};
