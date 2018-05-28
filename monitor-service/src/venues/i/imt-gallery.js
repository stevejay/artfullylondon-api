'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = async function() {
  const $ = await pageLoader('http://www.imagemusictext.com/next');
  const data = $('.entry-content').html();
  return { data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader('http://www.imagemusictext.com/contact');
  return $('#main .entry-content').html();
};
