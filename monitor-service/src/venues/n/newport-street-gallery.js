'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = async function() {
  let $ = await pageLoader(
    'http://www.newportstreetgallery.com/exhibitions/current'
  );

  const data = [];

  data.push($('.exhibition-current .intro-inner').html());
  data.push($('.exhibition-current .desc').html());

  $ = await pageLoader(
    'http://www.newportstreetgallery.com/exhibitions/forthcoming'
  );

  data.push($('.exhibition-forthcoming .intro-inner').html());
  data.push($('.exhibition-forthcoming .desc').html());

  return { data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader('http://www.newportstreetgallery.com/visit');
  return $('#visit').html();
};
