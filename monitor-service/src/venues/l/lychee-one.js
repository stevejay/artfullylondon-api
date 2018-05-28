'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = async function() {
  let $ = await pageLoader('http://lycheeone.com/wp/exhibitions/');
  const data = [$('#content article').html()];

  $ = await pageLoader('http://lycheeone.com/wp/exhibitions/forthcoming/');
  data.push($('#content article').html());

  return { data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader('http://lycheeone.com/wp/contact/');
  return $('article .entry-content').html();
};
