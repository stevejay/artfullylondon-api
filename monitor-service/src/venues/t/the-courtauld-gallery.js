'use strict';


const pageLoader = require('../../venue-processing/page-loader').spaLoader;

exports.pageParser = async function() {
  let $ = await pageLoader(
    'http://courtauld.ac.uk/gallery/what-on/exhibitions-displays',
    '.article-content'
  );

  const data = [$('.article-content').html()];

  $ = await pageLoader(
    'http://courtauld.ac.uk/gallery/what-on/calendar?show_all=true',
    '.post-listing ul'
  );

  data.push($('.post-listing ul').html());

  return { data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader('http://courtauld.ac.uk/gallery/opening-hours');
  return $('.article-content').html();
};
