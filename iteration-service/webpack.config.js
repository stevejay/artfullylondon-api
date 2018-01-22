'use strict';

const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {
  entry: {
    '/handlers/start-iteration': './handlers/start-iteration.js',
    '/handlers/end-iteration': './handlers/end-iteration.js',
    '/handlers/add-iteration-error': './handlers/add-iteration-error.js',
    '/handlers/get-latest-iteration-errors': './handlers/get-latest-iteration-errors.js',
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
