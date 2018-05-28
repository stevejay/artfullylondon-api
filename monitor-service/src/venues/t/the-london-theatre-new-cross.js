'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = async function() {
  const $ = await pageLoader('http://www.thelondontheatre.com/7.html');
  const data = $('#content_container');
  return { data };
};
