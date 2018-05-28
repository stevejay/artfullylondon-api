'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.reallyusefultheatres.co.uk';

module.exports = function(theatreUrlName) {
  return {
    pageFinder: async function() {
      const $ = await pageLoader(BASE_URL + '/our-theatres/' + theatreUrlName);
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
    pageParser: async function(pageUrl) {
      let $ = await pageLoader(pageUrl);
      const title = $('title').html();
      const data = $('#show-about-main').html();

      const timesAndPricesHref = $('#nav-overview')
        .find('a:contains("Times")')
        .attr('href');

      $ = await pageLoader(BASE_URL + timesAndPricesHref);
      const times = $('#shows-about-inner').html();

      return { title, data: [data, times] };
    }),
  };
};
