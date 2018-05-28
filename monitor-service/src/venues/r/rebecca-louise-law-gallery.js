'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = async function() {
  const $ = await pageLoader('http://www.rebeccalouiselaw.com/whats-on');

  const data = $('#wrapper section article').each(function() {
    return $(this).html();
  });

  return { data };
};
