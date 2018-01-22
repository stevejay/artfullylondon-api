const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {
  entry: {
    '/handlers/autocomplete-search': './handlers/autocomplete-search.js',
    '/handlers/basic-search': './handlers/basic-search.js',
    '/handlers/event-advanced-search': './handlers/event-advanced-search.js',
    '/handlers/preset-search': './handlers/preset-search.js',
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
