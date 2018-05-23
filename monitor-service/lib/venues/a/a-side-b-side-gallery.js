'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = co.wrap(function*() {
  const $ = yield pageLoader('http://www.asidebsidegallery.com/gallery.html');

  const data = $('#body_layer p:not(:has(a))').each(function() {
    return $(this).html();
  });

  return { data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader('http://www.asidebsidegallery.com/contact.html');
  return $('#footer_layer').html();
});
