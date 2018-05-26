"use strict";

const nodeExternals = require("webpack-node-externals");
const slsw = require("serverless-webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WebpackOnBuildPlugin = require("on-build-webpack");
const chmod = require("chmod");

module.exports = {
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  entry: slsw.lib.entries,
  target: "node",
  output: {
    libraryTarget: "commonjs",
    path: path.join(__dirname, ".webpack"),
    filename: "[name].js"
  },
  externals: [nodeExternals(), "aws-sdk"],
  resolve: { modules: [__dirname] },
  plugins: [
    new CopyWebpackPlugin([{ from: "./bin/phantomjs" }]),
    new WebpackOnBuildPlugin(() => {
      chmod(".webpack/phantomjs", 777);
    })
  ]
};
