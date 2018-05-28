'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.alisonjacquesgallery.com';

exports.pageFinder = async function() {
  const result = [];

  function hrefCallback() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  }

  let $ = await pageLoader(BASE_URL + '/exhibitions/forthcoming/');
  $('#exhibitions-grid-forthcoming a:has(img)').each(hrefCallback);
  $('#exhibitions-grid-forthcoming_featured a:has(img)').each(hrefCallback);

  $ = await pageLoader(BASE_URL + '/exhibitions/current/');
  $('#exhibitions-grid-current a:has(img)').each(hrefCallback);
  $('#exhibitions-grid-current_featured a:has(img)').each(hrefCallback);

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h1').html();
  const data = $('.exhibition-header').html();
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader('http://www.alisonjacquesgallery.com/gallery/');
  return $('#content_module').html();
};
