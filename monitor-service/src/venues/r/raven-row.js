'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = async function() {
  let $ = await pageLoader('http://www.ravenrow.org/forthcoming/');

  const data = $('.wrapwrap .mb_sngl').each(function() {
    return $(this).html();
  });

  return { data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader('http://www.ravenrow.org/home/');
  return $('.openinghours').html();
};
