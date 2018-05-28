'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = async function() {
  const $ = await pageLoader('http://www.c4rd.org.uk/WHATS_ON.html');

  const data = $('.graphic_textbox_layout_style_default p').each(function() {
    $(this).html();
  });

  return { data };
};
