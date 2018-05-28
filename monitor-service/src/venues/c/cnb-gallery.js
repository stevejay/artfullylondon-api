'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = async function() {
  const $ = await pageLoader('http://cnbgallery.com/current-exhibition/');

  const data = $('#inner-content p').each(function() {
    $(this).html();
  });

  return { data };
};
