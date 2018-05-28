'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.benbrownfinearts.com';

exports.pageFinder = async function() {
  const result = [];
  let $ = await pageLoader(BASE_URL + '/exhibitions/');

  function hrefCallback() {
    let href = $(this).attr('href');
    result.push(BASE_URL + href);
  }

  $('#exhibitions-grid-current a:has(.image):has(.location.london)').each(
    hrefCallback
  );

  $(
    '#exhibitions-grid-current_featured a:has(.image):has(.location.london)'
  ).each(hrefCallback);

  $('#exhibitions-grid-forthcoming a:has(.image):has(.location.london)').each(
    hrefCallback
  );

  $(
    '#exhibitions-grid-forthcoming_featured a:has(.image):has(.location.london)'
  ).each(hrefCallback);

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('h1').html();
  const data = [$('.exhibition-header').html(), $('.description').html()];
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/contact/');
  return $('#content').html();
};
