'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').spaLoader;

const BASE_URL = 'http://thephotographersgallery.org.uk';
const CATEGORY_REGEX = /PRINT SALES GALLERY|WORKSHOPS|THE SOCIAL/i;
const TITLE_REGEX = /Folio Friday/i;

module.exports.pageUrlChunks = 2;

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  let pageNo = 1;

  while (true) {
    const $ = yield pageLoader(
      `${BASE_URL}/whats-on?page=${pageNo}`,
      '#content'
    );

    const items = $('#records .item');
    if (items.length === 0) {
      break;
    }

    const links = items.filter(function() {
      const category = $(this).find('.copy .category').text();
      const title = $(this).find('.copy h2');
      return !CATEGORY_REGEX.test(category) && !TITLE_REGEX.test(title);
    });

    links.each(function() {
      const href = $(this).find('a:has(img)').attr('href');
      result.push(BASE_URL + href);
    });

    ++pageNo;
  }

  return result.slice(0, 20); // TODO increase
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('#content h1').html();
  const data = [$('#content .itemHeader').html(), $('#content #INFO').html()];
  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/visit-us');
  return $('#content').html();
});
