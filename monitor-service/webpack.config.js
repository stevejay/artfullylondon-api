'use strict';

const nodeExternals = require('webpack-node-externals');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackOnBuildPlugin = require('on-build-webpack');
const chmod = require('chmod');

module.exports = {
  entry: {
    '/handlers/iterate-venues': './handlers/iterate-venues.js',
    '/handlers/iterate-venues-sns': './handlers/iterate-venues-sns.js',

    '/handlers/venue-monitor/get-venue-monitor': './handlers/venue-monitor/get-venue-monitor.js',
    '/handlers/venue-monitor/update-venue-monitor': './handlers/venue-monitor/update-venue-monitor.js',

    '/handlers/venue-event-monitor/get-venue-event-monitor': './handlers/venue-event-monitor/get-venue-event-monitor.js',
    '/handlers/venue-event-monitor/get-venue-event-monitors': './handlers/venue-event-monitor/get-venue-event-monitors.js',
    '/handlers/venue-event-monitor/update-venue-event-monitor': './handlers/venue-event-monitor/update-venue-event-monitor.js',

    '/handlers/send-monitor-status-email': './handlers/send-monitor-status-email.js',
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
  plugins: [
    new CopyWebpackPlugin([{ from: './bin/phantomjs' }]),
    new WebpackOnBuildPlugin(() => {
      chmod('.webpack/phantomjs', 777);
    }),
  ],
};
