'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = async function() {
  const data = [];

  let $ = await pageLoader('http://www.parasol-unit.org/current');
  data.push($('#content').html());

  $ = await pageLoader('http://www.parasol-unit.org/upcoming-exhibitions');
  data.push($('#content').html());

  return { data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader('http://www.parasol-unit.org');
  return $('#footer > .copy').html();
};
