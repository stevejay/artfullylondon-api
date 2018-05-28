'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = async function() {
  const $ = await pageLoader('http://www.espaciogallery.com/');
  const data = $('h2 + .paragraph').html();
  return { data };
};
