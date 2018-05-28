'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = async function() {
  const $ = await pageLoader(
    'http://www.emmahilleagle.com/exhibitions/current-exhibition/'
  );

  const data = $('article').html();
  return { data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader('http://www.emmahilleagle.com/contact/');
  return $('#primary #content .entry-content').html();
};
