"use strict";
const nodeExternals = require("webpack-node-externals");
const slsw = require("serverless-webpack");
const path = require("path");

module.exports = {
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  entry: slsw.lib.entries,
  target: "node",
  optimization: { minimize: false },
  performance: { hints: false },
  devtool: "nosources-source-map",
  output: {
    libraryTarget: "commonjs2",
    path: path.join(__dirname, ".webpack"),
    filename: "[name].js",
    sourceMapFilename: "[file].map"
  },
  externals: [nodeExternals(), "aws-sdk", "imagemagick"],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{ loader: "babel-loader" }]
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        use: [{ loader: "graphql-import-loader" }]
      }
    ]
  },
  resolve: { modules: [__dirname] }
};
