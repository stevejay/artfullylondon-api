'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageFinder = async function() {
  return [
    'http://www.geffrye-museum.org.uk/whatson/exhibitions-and-displays/',
    'http://www.geffrye-museum.org.uk/whatson/future/',
  ];
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('.contentMain').html();
  return { title, data };
};
