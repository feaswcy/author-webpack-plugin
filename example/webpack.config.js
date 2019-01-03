'use strict';
var AuthorWebpackPlugin = require('..');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
  mode: 'development',
  // context: __dirname,
  // devtool: 'eval',
  entry: path.resolve(__dirname, './src/entry.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    libraryTarget: "amd",
  },
  plugins: [
    new AuthorWebpackPlugin(),
    new HtmlWebpackPlugin()
  ]
};
