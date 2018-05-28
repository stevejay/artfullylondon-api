'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.gettyimagesgallery.com';

exports.pageFinder = async function() {
  const result = [];

  let $ = await pageLoader(BASE_URL + '/exhibitions/default.aspx');
  $('.currentexhibition a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  $('.exhibitionrighpanel .collection-entry a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  $('.exhibitionrightpanel .collection-entry a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('.proddetails').html();
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/contact.aspx');
  return $('.contactinnerpanelright').html();
};
