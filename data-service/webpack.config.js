const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {
  entry: {
    '/handlers/sitemap': './handlers/sitemap.js',
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
