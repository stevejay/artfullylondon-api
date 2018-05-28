'use strict';


const pageLoader = require('../../venue-processing/page-loader').spaLoader;

exports.pageParser = async function() {
  const $ = await pageLoader(
    'http://londonartsboard.blogspot.co.uk/search/label/Current%20Exhibition',
    '.article-content'
  );

  const data = $('.article-content').html();
  return { data };
};
