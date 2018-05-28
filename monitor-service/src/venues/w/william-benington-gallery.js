'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = async function() {
  const data = [];

  let $ = await pageLoader('http://williambeningtongallery.co.uk/londonevents');
  data.push($('#page').html());

  return { data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader('http://williambeningtongallery.co.uk/contact/');

  return $(
    '.sqs-block-content:has(h3:contains("WILLIAM BENINGTON GALLERY"))'
  ).each(function() {
    $(this).html();
  });
};
