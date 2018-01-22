const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {
  entry: {
    '/handlers/create-tag': './handlers/create-tag.js',
    '/handlers/delete-tag': './handlers/delete-tag.js',
    '/handlers/get-all-tags': './handlers/get-all-tags.js',
    '/handlers/get-tags': './handlers/get-tags.js',
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
