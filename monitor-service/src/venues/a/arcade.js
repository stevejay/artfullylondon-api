'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = async function() {
  const $ = await pageLoader('http://arcadefinearts.com/exhibitions/current');
  const data = $('article').html();
  return { data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader('http://arcadefinearts.com/gallery');
  return $('#gallery-details').html();
};
