'use strict';


const pageLoader = require('../../venue-processing/page-loader').spaLoader;

exports.pageParser = async function() {
  let $ = await pageLoader('http://www.storestreetgallery.com/exhibitions/');
  const data = $('.sidearea').html();
  return { data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader('http://www.storestreetgallery.com/contact/');
  return $('#contact-details').html();
};
