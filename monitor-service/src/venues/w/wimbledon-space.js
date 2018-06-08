'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://events.arts.ac.uk';

exports.minimumExpectedEvents = 0;

exports.pageFinder = async function() {
  const result = [];
  let $ = await pageLoader(
    BASE_URL +
      '/eventpage?pg=1&programmes=Wimbledon%20College%20of%20Arts&types=all&keyword=wimbledonspace'
  );

  $('.search-results-list a.eventname').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('[id=\'thePage:longdesc\']').html();
  return { title, data };
};