'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.bl.uk';

module.exports.pageFinder = co.wrap(function*() {
  const eventSubTypes = [
    'exhibition',
    'lecture',
    'in%20conversation',
    'discussion',
  ];

  const result = [];

  for (var i = 0; i < eventSubTypes.length; ++i) {
    const eventSubType = eventSubTypes[i];
    const $ = yield pageLoader(
      BASE_URL + '/events?eventsubtype=' + eventSubType
    );

    $('#eventsList a:has(img)').each(function() {
      const href = $(this).attr('href');
      result.push(BASE_URL + href);
    });
  }

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('h1').html();

  const data = [
    $('.main-content-block .main-column-inner .text-block').html(),
    $('.text-block:has(h2:contains("Details"))').html(),
  ];

  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(
    BASE_URL + '/aboutus/quickinfo/loc/seasonalclosures/index.html'
  );
  return $('#pagecontent table').html();
});
