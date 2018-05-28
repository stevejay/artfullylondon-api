'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.halesgallery.com';

exports.pageParser = async function() {
  const data = [];

  let $ = await pageLoader('http://www.halesgallery.com/exhibitions/current/');
  data.push($('#content').html());

  $ = await pageLoader('http://www.halesgallery.com/exhibitions/forthcoming/');
  data.push($('#content').html());

  return { data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/about/contact/');
  return $('#location1').html();
};
