'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = async function() {
  const $ = await pageLoader('http://www.ltmuseum.co.uk/whats-on/exhibitions');
  const data = $('section.article-intro').html();
  return { data };
};
