'use strict';


const pageLoader = require('../../venue-processing/page-loader').spaLoader;

exports.pageParser = async function() {
  const $ = await pageLoader(
    'http://www.arts.ac.uk/csm/whats-on-at-csm/platform-theatre/',
    'h1.WhatsOnHeading'
  );

  const title = $('title').html();
  const data = $('.EventsList .Events').html();
  return { data, title };
};
