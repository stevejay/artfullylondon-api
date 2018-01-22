'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://autograph-abp.co.uk';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(BASE_URL + '/exhibitions');

  $('#content .exhibition-item a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();

  const data = [
    $('#content .info-box').html(),
    $('#content #description').html(),
  ];

  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/visitor-info');
  return $('#dbmaincontent').each(() => $(this).html());
});

// Rivington Place is fully accessible, with a lift and step free access to all areas of the building. Large print captions are available at reception. Please phone ahead to book a disabled parking bay, or to discuss your access needs: 020 7749 1240.
// We welcome visitors with children to the gallery. Baby changing facilities are located in the ground floor toilet.
