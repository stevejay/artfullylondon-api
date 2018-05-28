'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = async function() {
  const $ = await pageLoader(
    'http://www.islingtonartsfactory.org/exhibitions.html'
  );

  const data = $('#wsite-content .paragraph').each(function() {
    $(this).html();
  });

  return { data };
};
