'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = async function() {
  const $ = await pageLoader('http://www.houldsworth.co.uk/exhibitions');
  const data = $('#site_navigation_03').html();
  return { data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader('http://www.houldsworth.co.uk/contact');
  return $('#site_main_content').html();
};
