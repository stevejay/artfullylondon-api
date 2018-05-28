'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://gazelliarthouse.com';

exports.pageFinder = async function() {
  const result = [];

  let $ = await pageLoader(BASE_URL + '/exhibitions/');
  $('#sectionOne a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result.slice(0, 5);
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('#sectionOne .contentBox').html();
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/contact-us/');
  return $('.address-section').html();
};
