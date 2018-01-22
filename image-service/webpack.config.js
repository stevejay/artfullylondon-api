'use strict';

const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {
  entry: {
    '/handlers/add-image': './handlers/add-image.js',
    '/handlers/get-image': './handlers/get-image.js',
    '/handlers/reprocess-images': './handlers/reprocess-images.js',
    '/handlers/reprocess-images-sns': './handlers/reprocess-images-sns.js',
  },
  target: 'node',
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  externals: [nodeExternals(), 'aws-sdk', 'imagemagick'],
  resolve: {
    root: __dirname,
  },
  plugins: [],
};
