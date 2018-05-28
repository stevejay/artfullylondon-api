'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageFinder = async function() {
  const result = [];

  let $ = await pageLoader(
    'http://www.aaschool.ac.uk/PUBLIC/WHATSON/Exhibitions.php?filter=0'
  );
  $('.exhibition_list dd .description > a').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  $ = await pageLoader(
    'http://www.aaschool.ac.uk/PUBLIC/WHATSON/Exhibitions.php?filter=2'
  );
  $('.exhibition_list dd .description > a').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  $ = await pageLoader(
    'http://www.aaschool.ac.uk/PUBLIC/WHATSON/publiclectures.php'
  );
  $('.eventList a:first-of-type').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  let title, data;

  if (pageUrl.includes('/VIDEO/lecture')) {
    title = $('#lblTitle').html();

    data = [$('#lblInfo').html(), $('#lblDescription').html()];
  } else {
    title = $('.exhibition_list dd .description .location').html();
    data = $('.exhibition_list dd .description').html();
  }

  return { title, data };
};
