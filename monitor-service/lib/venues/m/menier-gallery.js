'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

module.exports.pageParser = co.wrap(function*() {
  const $ = yield pageLoader(
    'http://www.meniergallery.co.uk/Menier_Gallery/Exhibitions.html'
  );

  const data = [$('.exhibition_title').html(), $('.exhibition_dates').html()];
  return { data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(
    'http://www.meniergallery.co.uk/Menier_Gallery/Contact.html'
  );

  return $('.text-content p').each(function() {
    $(this).html();
  });
});
