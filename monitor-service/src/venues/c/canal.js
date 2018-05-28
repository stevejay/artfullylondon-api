'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = async function() {
  const $ = await pageLoader('http://www.canalprojects.info/gallery.php');
  const data = $('#sliderText').html();
  return { data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader('http://www.canalprojects.info/contact.php');
  return $('#aboutRight').html();
};
