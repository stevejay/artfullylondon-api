'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = co.wrap(function*() {
  const data = [];

  let $ = yield pageLoader('http://www.peeruk.org/current/');
  $('#page .sqs-block-content').each(function() {
    data.push($(this).html());
  });

  $ = yield pageLoader('http://www.peeruk.org/forthcoming/');
  $('#page .sqs-block-content').each(function() {
    data.push($(this).html());
  });

  return { data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader('http://www.peeruk.org/contact/');

  return $('#page p').each(function() {
    $(this).html();
  });
});
