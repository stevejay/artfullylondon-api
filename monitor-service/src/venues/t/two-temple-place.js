'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = async function() {
  const data = [];

  const $ = await pageLoader('http://twotempleplace.org/exhibitions/');
  data.push($('h1 + div').html());

  return { data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader('http://twotempleplace.org/visit/hours/');
  return $('.col1.col').html();
};
