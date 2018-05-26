'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.saatchigallery.com';

exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(`${BASE_URL}/whatson.php`);

  $('.exhibition a:has(h3)').each(function() {
    let href = $(this).attr('href');

    if (!href.startsWith('http')) {
      href = BASE_URL + href;
    }

    result.push(href);
  });

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();
  const data = [];

  $('#content_blocks h3').each(function() {
    data.push($(this).html());
  });

  data.push($('#leftside_records').html());

  return { title, data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL);
  return $('#rightcol .borderedbox').html();
});
