'use strict';

const qsm = require('qsm');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageFinder = async function() {
  const result = [];
  const $ = await pageLoader('http://beaconsfield.ltd.uk/projects/');

  $('#content a:has(img)').each(function() {
    let href = $(this).attr('href');
    result.push(qsm.clear(href));
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('#content-text').html();
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader('http://beaconsfield.ltd.uk/about/visiting/');
  return $('.entry-content').html();
};
