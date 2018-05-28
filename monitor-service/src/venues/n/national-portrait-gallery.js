'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.npg.org.uk';

exports.pageFinder = async function() {
  const result = [];

  let $ = await pageLoader(
    `${BASE_URL}/whatson/events-calendar.php?filterDate=&eventType=Exhibition&eventKeyword=&eventsSubmit.x=44&eventsSubmit.y=7`
  );

  $('#eventsListing .eventsItem a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + '/' + href);
  });

  $ = await pageLoader(
    `${BASE_URL}/whatson/events-calendar.php?filterDate=&eventType=Display&eventKeyword=&eventsSubmit.x=40&eventsSubmit.y=5`
  );

  $('#eventsListing .eventsItem a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + '/' + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();
  const data = [$('#main-content-box').html()];

  $('#eventDetails p').each(function() {
    data.push($(this).html());
  });

  return { title, data };
};
