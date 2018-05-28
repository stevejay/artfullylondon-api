'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = async function() {
  const data = [];

  let $ = await pageLoader('http://www.wilkinsongallery.com/');
  data.push($('#container .right-col').html());

  return { data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader('http://www.wilkinsongallery.com/');
  return $('#container .section.left-col').html();
};
