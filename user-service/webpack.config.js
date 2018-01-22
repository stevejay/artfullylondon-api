'use strict';

const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {
  entry: {
    '/handlers/get-user': './handlers/get-user.js',
    '/handlers/delete-user': './handlers/delete-user.js',
    '/handlers/auth': './handlers/auth.js',
    '/handlers/get-watches': './handlers/get-watches.js',
    '/handlers/update-watches': './handlers/update-watches.js',
    '/handlers/get-preferences': './handlers/get-preferences.js',
    '/handlers/update-preferences': './handlers/update-preferences.js',
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
