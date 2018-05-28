'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = async function() {
  let $ = await pageLoader('http://www.purdyhicks.com/exhibitions.php?opt=c');
  const data = [$('#mainContent').html()];

  $ = await pageLoader('http://www.purdyhicks.com/exhibitions.php?opt=f');
  data.push($('#mainContent').html());

  return { data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader('http://www.purdyhicks.com/contact.php');
  return $('#text').html();
};
