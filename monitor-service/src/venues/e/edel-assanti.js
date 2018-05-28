'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = async function() {
  const $ = await pageLoader('http://edelassanti.com/exhibitions/');
  const data = $('.exhibition-header').html();
  return { data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader('http://edelassanti.com/contact/');
  return $('#content #content_module').html();
};
