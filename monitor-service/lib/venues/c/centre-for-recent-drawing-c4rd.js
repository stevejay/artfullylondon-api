'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = co.wrap(function*() {
  const $ = yield pageLoader('http://www.c4rd.org.uk/WHATS_ON.html');

  const data = $('.graphic_textbox_layout_style_default p').each(function() {
    $(this).html();
  });

  return { data };
});
