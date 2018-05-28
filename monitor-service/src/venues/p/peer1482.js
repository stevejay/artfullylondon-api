'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = async function() {
  const data = [];

  let $ = await pageLoader('http://www.peeruk.org/current/');
  $('#page .sqs-block-content').each(function() {
    data.push($(this).html());
  });

  $ = await pageLoader('http://www.peeruk.org/forthcoming/');
  $('#page .sqs-block-content').each(function() {
    data.push($(this).html());
  });

  return { data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader('http://www.peeruk.org/contact/');

  return $('#page p').each(function() {
    $(this).html();
  });
};
