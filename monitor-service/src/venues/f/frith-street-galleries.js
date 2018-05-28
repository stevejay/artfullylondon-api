'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.frithstreetgallery.com';

module.exports = function() {
  return {
    pageFinder: async function() {
      const result = [];

      let $ = await pageLoader(BASE_URL + '/shows/current/');
      $('#content_wrapper h3 > a').each(function() {
        const href = $(this).attr('href');
        result.push(BASE_URL + href);
      });

      $ = await pageLoader(BASE_URL + '/shows/forthcoming/');
      $('#content_wrapper h3 > a').each(function() {
        const href = $(this).attr('href');
        result.push(BASE_URL + href);
      });

      return result;
    }),
    pageParser: async function(pageUrl) {
      const $ = await pageLoader(pageUrl);
      const title = $('title').html();
      const data = $('#content_wrapper .end').html();
      return { title, data };
    }),
    venueOpenings: async function() {
      const $ = await pageLoader(BASE_URL + '/contact/');
      return $('#content_wrapper .end').html();
    }),
  };
};
