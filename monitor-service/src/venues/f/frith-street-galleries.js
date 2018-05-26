'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.frithstreetgallery.com';

module.exports = function() {
  return {
    pageFinder: co.wrap(function*() {
      const result = [];

      let $ = yield pageLoader(BASE_URL + '/shows/current/');
      $('#content_wrapper h3 > a').each(function() {
        const href = $(this).attr('href');
        result.push(BASE_URL + href);
      });

      $ = yield pageLoader(BASE_URL + '/shows/forthcoming/');
      $('#content_wrapper h3 > a').each(function() {
        const href = $(this).attr('href');
        result.push(BASE_URL + href);
      });

      return result;
    }),
    pageParser: co.wrap(function*(pageUrl) {
      const $ = yield pageLoader(pageUrl);
      const title = $('title').html();
      const data = $('#content_wrapper .end').html();
      return { title, data };
    }),
    venueOpenings: co.wrap(function*() {
      const $ = yield pageLoader(BASE_URL + '/contact/');
      return $('#content_wrapper .end').html();
    }),
  };
};
