'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = async function() {
  const $ = await pageLoader('https://graffikgallery.co.uk/exhibitions/');
  const title = $('title').html();

  const data = $(
    '.vc_column-inner:has(h2:contains("Current Exhibitions"))'
  ).html();

  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader('https://graffikgallery.co.uk/contact/');
  
  return $('.wpb_text_column').each(function() {
    $(this).html();
  });
};
