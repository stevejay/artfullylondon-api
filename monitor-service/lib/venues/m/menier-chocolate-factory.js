'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.menierchocolatefactory.com';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];

  const $ = yield pageLoader(
    BASE_URL +
      '/Online/default.asp?doWork::WScontent::loadArticle=Load&BOparam::WScontent::loadArticle::article_id=39729810-70D5-4EA6-AC95-A353C92526EF'
  );

  $('.whats-on-event a.more-info-link').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + '/Online/' + href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();
  const data = [$('#main_table #av_left').html()];

  $('#main_table #av_center p').each(function() {
    data.push($(this).html());
  });

  return { title, data };
});
