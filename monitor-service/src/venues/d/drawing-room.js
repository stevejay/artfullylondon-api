'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://drawingroom.org.uk';

exports.pageFinder = async function() {
  const $ = await pageLoader(BASE_URL + '/exhibitions');
  const result = [];

  $('.exhib_list_item a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('#main').html();
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/visit');
  return $('.visit_opening').html();
};
