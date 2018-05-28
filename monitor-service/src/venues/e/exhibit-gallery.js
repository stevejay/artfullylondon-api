'use strict';


const pageLoader = require('../../venue-processing/page-loader').spaLoader;

exports.pageParser = async function() {
  const $ = await pageLoader(
    'http://www.exhibit-goldenlane.com/',
    'div.exhibit-name'
  );

  const data = $('div.exhibit-name').html();
  return { data };
};
