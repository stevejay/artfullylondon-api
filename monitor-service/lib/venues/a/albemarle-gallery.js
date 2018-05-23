'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = co.wrap(function*() {
  const $ = yield pageLoader('http://www.albemarlegallery.com/exhibitions.php');

  const data = $('#maincontent table').each(function() {
    return $(this).html();
  });

  return { data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader('http://www.albemarlegallery.com/contact.php');
  return $('#main').html();
});
