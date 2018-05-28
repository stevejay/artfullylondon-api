'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = async function() {
  const $ = await pageLoader(
    'http://www.meniergallery.co.uk/Menier_Gallery/Exhibitions.html'
  );

  const data = [$('.exhibition_title').html(), $('.exhibition_dates').html()];
  return { data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(
    'http://www.meniergallery.co.uk/Menier_Gallery/Contact.html'
  );

  return $('.text-content p').each(function() {
    $(this).html();
  });
};
