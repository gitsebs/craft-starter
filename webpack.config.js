var webpack = require('webpack');
var path = require('path');

module.exports = {
  devtool: 'eval-source-map',
  entry: ['./craft/templates/_index.js'],
  output: {
    path: require('path').join(__dirname, 'assets'),
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ],
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loaders: ['babel'] }
    ]
  }
}
