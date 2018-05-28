'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = async function() {
  const $ = await pageLoader(
    'http://www.theryderprojects.com/exhibitions.html'
  );

  const data = $('#content-wrapper').html();
  return { data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader('http://www.theryderprojects.com/contact.html');
  return $('#wsite-content').html();
};
