'use strict';

const errorHandler = require('lambda-generator-handler/lib/error-handler');
const search = require('../lib/services/search');

module.exports.handler = (event, context, cb) => {
  search
    .getSitemapLinks(new Date())
    .then(links => {
      cb(null, {
        statusCode: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
        },
        body: links.join('\n'),
      });
    })
    .catch(err => errorHandler(err, cb));
};
