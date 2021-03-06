const path = require('path');
const merge = require('webpack-merge')
const MiniPlugin = require('mini-program-webpack-loader').plugin;
const baseConfig = require('./webpack.config.base');

module.exports = merge(baseConfig, {
  entry: [
    path.resolve(__dirname, '../example/app.json')
  ],
  output: {
    path: path.resolve(__dirname, '../dist')
  },
  plugins: [
    new MiniPlugin()
  ]
});
