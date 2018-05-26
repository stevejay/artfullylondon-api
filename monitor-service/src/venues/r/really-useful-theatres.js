'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.reallyusefultheatres.co.uk';

module.exports = function(theatreUrlName) {
  return {
    pageFinder: co.wrap(function*() {
      const $ = yield pageLoader(BASE_URL + '/our-theatres/' + theatreUrlName);
      const links = $('article div.wrapper:has(h2:contains("Now Booking")) a');
      const result = [];

      links.each(function() {
        const href = $(this)
          .attr('href')
          .replace('/performances/', '/performances/show/');

        if (href.includes('/performances/')) {
          result.push(BASE_URL + href);
        }
      });

      return result;
    }),
    pageParser: co.wrap(function*(pageUrl) {
      let $ = yield pageLoader(pageUrl);
      const title = $('title').html();
      const data = $('#show-about-main').html();

      const timesAndPricesHref = $('#nav-overview')
        .find('a:contains("Times")')
        .attr('href');

      $ = yield pageLoader(BASE_URL + timesAndPricesHref);
      const times = $('#shows-about-inner').html();

      return { title, data: [data, times] };
    }),
  };
};
