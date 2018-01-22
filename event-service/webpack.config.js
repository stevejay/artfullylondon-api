'use strict';

const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {
  entry: {
    '/handlers/venue/create-or-update-venue': './handlers/venue/create-or-update-venue.js',
    '/handlers/venue/get-venue': './handlers/venue/get-venue.js',
    '/handlers/venue/get-next-venue': './handlers/venue/get-next-venue.js',
    '/handlers/venue/get-venue-for-edit': './handlers/venue/get-venue-for-edit.js',
    '/handlers/venue/get-venue-multi': './handlers/venue/get-venue-multi.js',

    '/handlers/talent/create-or-update-talent': './handlers/talent/create-or-update-talent.js',
    '/handlers/talent/get-talent': './handlers/talent/get-talent.js',
    '/handlers/talent/get-talent-for-edit': './handlers/talent/get-talent-for-edit.js',
    '/handlers/talent/get-talent-multi': './handlers/talent/get-talent-multi.js',

    '/handlers/event/create-or-update-event': './handlers/event/create-or-update-event.js',
    '/handlers/event/get-event': './handlers/event/get-event.js',
    '/handlers/event/get-event-for-edit': './handlers/event/get-event-for-edit.js',
    '/handlers/event/get-event-multi': './handlers/event/get-event-multi.js',

    '/handlers/event-series/create-or-update-event-series': './handlers/event-series/create-or-update-event-series.js',
    '/handlers/event-series/get-event-series': './handlers/event-series/get-event-series.js',
    '/handlers/event-series/get-event-series-for-edit': './handlers/event-series/get-event-series-for-edit.js',
    '/handlers/event-series/get-event-series-multi': './handlers/event-series/get-event-series-multi.js',

    '/handlers/search/refresh-search-index': './handlers/search/refresh-search-index.js',
    '/handlers/search/refresh-search-index-sns': './handlers/search/refresh-search-index-sns.js',
    '/handlers/search/refresh-event-full-search': './handlers/search/refresh-event-full-search.js',
    '/handlers/search/update-event-search-index-sns': './handlers/search/update-event-search-index-sns.js',
  },
  target: 'node',
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  externals: [nodeExternals(), 'aws-sdk'],
  resolve: {
    root: __dirname,
  },
  plugins: [],
};
