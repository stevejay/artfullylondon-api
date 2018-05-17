const nodeExternals = require("webpack-node-externals");
const slsw = require("serverless-webpack");
const path = require("path");

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
  resolve: {
    modules: [__dirname]
  },
  plugins: []
};
