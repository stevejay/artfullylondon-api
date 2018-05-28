'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = async function() {
  const $ = await pageLoader('http://www.albemarlegallery.com/exhibitions.php');

  const data = $('#maincontent table').each(function() {
    return $(this).html();
  });

  return { data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader('http://www.albemarlegallery.com/contact.php');
  return $('#main').html();
};
