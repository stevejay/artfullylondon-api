'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = async function() {
  const $ = await pageLoader('http://www.hannahbarry.com/');
  const data = $('#intro').html();
  return { data };
};
