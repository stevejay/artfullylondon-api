'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = async function() {
  const $ = await pageLoader('http://www.greengrassi.com/Current');
  const title = $('title').html();
  const data = [$('.artist-column').html(), $('.date-column').html()];
  return { title, data };
};
