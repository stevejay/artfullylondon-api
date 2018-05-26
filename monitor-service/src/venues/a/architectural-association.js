'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageFinder = co.wrap(function*() {
  const result = [];

  let $ = yield pageLoader(
    'http://www.aaschool.ac.uk/PUBLIC/WHATSON/Exhibitions.php?filter=0'
  );
  $('.exhibition_list dd .description > a').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  $ = yield pageLoader(
    'http://www.aaschool.ac.uk/PUBLIC/WHATSON/Exhibitions.php?filter=2'
  );
  $('.exhibition_list dd .description > a').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  $ = yield pageLoader(
    'http://www.aaschool.ac.uk/PUBLIC/WHATSON/publiclectures.php'
  );
  $('.eventList a:first-of-type').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  let title, data;

  if (pageUrl.includes('/VIDEO/lecture')) {
    title = $('#lblTitle').html();

    data = [$('#lblInfo').html(), $('#lblDescription').html()];
  } else {
    title = $('.exhibition_list dd .description .location').html();
    data = $('.exhibition_list dd .description').html();
  }

  return { title, data };
});
