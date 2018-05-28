'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = async function() {
  let $ = await pageLoader('http://curiousdukegallery.com/exhibitions/current');
  const data = [$('article').html()];

  $ = await pageLoader('http://curiousdukegallery.com/exhibitions/future');
  data.push($('article').html());

  return { data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader('http://curiousdukegallery.com/contact');
  return $('.container .menu-col').html();
};
