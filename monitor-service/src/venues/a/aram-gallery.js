'use strict';

const pageLoader = require('../../venue-processing/page-loader').spaLoader;

exports.pageParser = async function() {
  const $ = await pageLoader(
    'https://www.thearamgallery.org/now',
    '#PAGES_CONTAINER'
  );

  const data = $('#PAGES_CONTAINER').html();
  return { data };
};
