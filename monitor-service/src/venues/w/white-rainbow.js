'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = async function() {
  const data = [];

  let $ = await pageLoader('http://white-rainbow.co.uk/exhibition/current/');
  data.push($('.entry-header').html());

  $ = await pageLoader('http://white-rainbow.co.uk/exhibition/future/');
  data.push($('#content article').html());

  return { data };
};
