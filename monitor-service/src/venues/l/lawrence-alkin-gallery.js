'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = async function() {
  let $ = await pageLoader('http://www.lawrencealkingallery.com/events');
  const data = [$('.eventarticle').html()];

  $ = await pageLoader('http://www.lawrencealkingallery.com/futureevents');
  data.push($('.futureeventsummary').html());

  return { data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader('http://www.lawrencealkingallery.com/contact');
  return $('#contactright').html();
};
